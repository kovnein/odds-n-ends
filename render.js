(function () {
  const grid = document.getElementById('project-grid');
  const emptyMsg = document.getElementById('grid-empty');

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function buildCard(project, index) {
    const {
      title = 'Untitled project',
      description = '',
      lang = 'other',
      status = 'standby',
      repo = '',
      demo = '',
      tags = []
    } = project;

    const isLive = status === 'live';
    const catalogNo = String(index + 1).padStart(2, '0');

    const card = document.createElement('article');
    card.className = 'card';
    card.style.setProperty('--delay', `${index * 45}ms`);

    const tagChips = tags.length
      ? `<ul class="chip-row">${tags.map(t => `<li class="chip">${escapeHtml(t)}</li>`).join('')}</ul>`
      : '';

    const actions = [];
    if (isLive && demo) {
      actions.push(`<a class="btn btn--primary" href="${escapeHtml(demo)}" target="_blank" rel="noopener noreferrer">Open <span aria-hidden="true">&rarr;</span></a>`);
    }
    if (repo) {
      actions.push(`<a class="btn btn--ghost" href="${escapeHtml(repo)}" target="_blank" rel="noopener noreferrer">Repo <span aria-hidden="true">&rarr;</span></a>`);
    }

    card.innerHTML = `
      <div class="card-top">
        <span class="catalog-no">UNIT-${catalogNo}</span>
        <span class="status" title="${isLive ? 'Live — has a web interface' : 'Standby — code complete, no web interface yet'}">
          <span class="led ${isLive ? 'led--live' : 'led--standby'}" aria-hidden="true"></span>
          ${isLive ? 'live' : 'standby'}
        </span>
      </div>
      <h2 class="card-title">${escapeHtml(title)}</h2>
      <p class="card-desc">${escapeHtml(description)}</p>
      ${tagChips}
      <div class="card-foot">
        <span class="lang-tag">${escapeHtml(lang)}</span>
        <div class="btn-row">${actions.join('')}</div>
      </div>
    `;
    return card;
  }

  function render() {
    const projects = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];
    if (!projects.length) {
      emptyMsg.hidden = false;
      return;
    }
    const frag = document.createDocumentFragment();
    projects.forEach((p, i) => frag.appendChild(buildCard(p, i)));
    grid.appendChild(frag);
  }

  render();
})();
