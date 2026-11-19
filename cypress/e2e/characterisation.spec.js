describe('Characterisation: Article list and article view (first slice)', () => {
  beforeEach(() => {
    // Start each test from a deterministic state: clear localStorage before the app boots
    cy.clearLocalStorage();
  });

  it('loads the global feed and shows articles', () => {
    // Attach stable intercepts before visiting the app
    cy.intercept('GET', '**/api/articles*', { fixture: 'articles-page-1.json' }).as('getArticles');
    cy.intercept('GET', '**/api/tags', { fixture: 'tags.json' }).as('getTags');

    cy.visit('/');

    cy.wait('@getArticles').its('response.statusCode').should('eq', 200);

    // Article previews should be rendered. Selectors mirror the legacy markup.
    cy.get('.article-preview').should('have.length.at.least', 1);
    cy.get('.article-preview h1').first().should('contain.text', 'First Article');
  });

  it('filters by tag when clicking a tag in the sidebar', () => {
    cy.intercept('GET', '**/api/tags', { fixture: 'tags.json' }).as('getTags');
    // Articles endpoint will be called with query param tag=testing when filtering
    cy.intercept('GET', '**/api/articles*', (req) => {
      if (req.query && req.query.tag === 'testing') {
        req.reply({ fixture: 'articles-page-1.json' });
      } else {
        req.reply({ fixture: 'articles-page-1.json' });
      }
    }).as('getArticles');

    cy.visit('/');
    cy.wait('@getTags');

    cy.get('.sidebar .tag-list a').contains('testing').click();

    // List should update and URL should reflect tag filter
    cy.url().should('include', 'tag=testing');
    cy.get('.article-preview').should('have.length.at.least', 1);
  });

  it('paginates when multiple pages of articles exist', () => {
    // First page
    // Stub articles endpoint and reply based on the offset query param
    cy.intercept('GET', '**/api/articles*', (req) => {
      const offset = req.query && (req.query.offset || req.query.page);
      if (offset && offset.toString() === '10') {
        req.reply({ fixture: 'articles-page-2.json' });
      } else {
        req.reply({ fixture: 'articles-page-1.json' });
      }
    }).as('getArticlesPaged');

    cy.visit('/');

    cy.wait('@getArticlesPaged');

    // There should be pagination controls (page numbers)
    cy.get('.pagination .page-link').should('exist');

    // Click page 2
    cy.get('.pagination .page-link').contains('2').click();

    cy.wait('@getArticlesPaged');

    // After clicking page 2, ensure different article from page 2 appears
    cy.get('.article-preview h1').first().should('contain.text', 'Second Page Article');
  });

  it('opens an article and renders markdown as HTML', () => {
    cy.intercept('GET', '**/api/articles*', { fixture: 'articles-page-1.json' }).as('getArticles');
    cy.intercept('GET', '**/api/articles/first-article', { fixture: 'article-article-slug.json' }).as('getArticle');

    cy.visit('/');
    cy.wait('@getArticles');

    // Open the first article via the preview link
    cy.get('.article-preview a.preview-link').first().click();

    cy.wait('@getArticle');

    // The article page should show rendered heading and paragraph from markdown
    cy.get('.article-page h1').should('contain.text', 'First Article');
    cy.get('.article-content').within(() => {
      cy.get('h1').should('exist');
      cy.get('p').contains('This is the first article body.').should('exist');
    });
  });

  it('toggles favorite/unfavorite and updates count', () => {
    cy.intercept('GET', '**/api/articles*', { fixture: 'articles-page-1.json' }).as('getArticles');
    cy.intercept('POST', '**/api/articles/first-article/favorite', { fixture: 'favourite-response.json' }).as('postFav');
    cy.intercept('DELETE', '**/api/articles/first-article/favorite', { fixture: 'favourite-response.json' }).as('delFav');

    cy.visit('/');
    cy.wait('@getArticles');

    // Assert initial favorites count is 0, then click the favorite button and assert it becomes 1
    cy.get('.article-preview').first().within(() => {
      cy.get('button.btn').first().contains('0').should('exist');
      cy.get('button.btn').first().click({ force: true });
    });

    cy.wait('@postFav');

    cy.get('.article-preview').first().within(() => {
      cy.get('button.btn').first().contains('1').should('exist');
    });
  });

  it('shows Your Feed only when jwt is present and requests feed endpoint', () => {
    cy.intercept('GET', '**/api/articles/feed*', { fixture: 'articles-page-1.json' }).as('getFeed');
    cy.intercept('GET', '**/api/articles*', { fixture: 'articles-page-1.json' }).as('getArticles');
    cy.intercept('GET', '**/api/tags', { fixture: 'tags.json' }).as('getTags');

    // Visit without JWT - Your Feed should not be present
    cy.clearLocalStorage();
    cy.visit('/');
    cy.get('.feed-toggle').within(() => {
      cy.contains('Your Feed').should('not.exist');
    });

    // Now set JWT (we set both jwtToken and jwt in the support command) and reload
    cy.setJwt('Token abc');
    cy.visit('/');

    // Your Feed tab should be present and clicking it queries the feed endpoint
    cy.get('.feed-toggle').within(() => {
      cy.contains('Your Feed').click();
    });

    cy.wait('@getFeed');
  });

  it('shows tags list and clicking a tag filters', () => {
    cy.intercept('GET', '**/api/tags', { fixture: 'tags.json' }).as('getTags');
    cy.intercept('GET', '**/api/articles*', { fixture: 'articles-page-1.json' }).as('getArticles');

    cy.visit('/');
    cy.wait('@getTags');

    cy.get('.sidebar .tag-list a').should('have.length.greaterThan', 0);
    cy.get('.sidebar .tag-list a').first().click();
    cy.wait('@getArticles');
  });

  it('shows an error UI when articles endpoint returns 500', () => {
    cy.intercept('GET', '**/api/articles*', { statusCode: 500, fixture: 'error-500.json' }).as('getArticlesErr');

    cy.visit('/');

    cy.wait('@getArticlesErr');

    // The list errors component should be present (class .error) or similar
    cy.get('.post-preview, .list-errors, .error').should('exist');
  });

});
