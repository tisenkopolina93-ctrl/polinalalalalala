let appData = { characters: [], movies: [], books: [] };
let favorites = new Set();
let userRatings = {};
let currentPage = 'home';
let currentView = 'grid';
let currentFilters = { search: '', team: '', status: '', phase: '', sortBy: '' };

// Генерация надёжного URL картинки с запасным вариантом
function getImageURL(id, name, bg = '#8b5a2b') {
    // Рабочие фото с picsum (всегда загружаются, если есть интернет)
    const picsumURL = `https://picsum.photos/id/${id}/200/150`;
    // Запасной вариант: цветной фон с текстом (встроенный SVG)
    const fallbackSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='${bg}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='20' font-family='Georgia'%3E${encodeURIComponent(name.slice(0, 18))}%3C/text%3E%3C/svg%3E`;
    // Возвращаем ссылку, но в HTML добавим onerror, который подставит fallback
    return picsumURL;
}

function generateCharacters() {
    const names = ["Фродо Бэггинс","Гэндальф Серый","Арагорн","Леголас","Гимли","Боромир","Сэмуайз Гэмджи","Мериадок Брендибак","Перегрин Тук","Саруман","Саурон","Голлум","Элронд","Галадриэль","Арвен","Эовин","Фарамир","Денетор","Теоден","Эомер","Древобород","Бильбо Бэггинс","Торин Дубощит","Азог","Келеборн"];
    const teams = ["Братство","Рохан","Гондор","Эльфы","Гномы","Братство","Хоббит","Хоббит","Хоббит","Изенгард","Мордор","Нейтральный","Эльфы","Лориэн","Ривенделл","Рохан","Гондор","Гондор","Рохан","Рохан","Фангорн","Хоббит","Гномы","Мордор","Эльфы"];
    const statuses = ["герой","герой","герой","герой","герой","герой","герой","герой","герой","злодей","злодей","антигерой","герой","герой","герой","герой","герой","нейтральный","герой","герой","нейтральный","герой","герой","злодей","герой"];
    return names.map((name, idx) => ({
        id: `char_${idx+1}`, type: 'character', name: name, description: `${name} — легендарный персонаж Средиземья.`, team: teams[idx % teams.length], status: statuses[idx % statuses.length], firstAppearance: 1937 + (idx * 2) % 80, powerLevel: 40 + (idx * 3) % 60, image: getImageURL(100+idx, name, '#6b4c2b'), abilities: ["Меч","Магия","Лук","Топор","Кольцо","Скрытность","Мудрость"][idx % 7]
    }));
}
function generateMovies() {
    const titles = ["Братство Кольца","Две крепости","Возвращение Короля","Нежданное путешествие","Пустошь Смауга","Битва пяти воинств","Братство (1978)","Возвращение (1980)","Хоббит (1977)","Война рохирримов","Падение Гондолина","Охота на Голлума","Тень прошлого","Эльфийский камень","Дети Хурина","Берен и Лутиэн","Северные войны","Последний союз","Кольцо Саурона","Исход","Ангмарион","Ночной страж","Легенда о Сильмариллионе","Сказание об Эарендиле","Вторжение ангмара"];
    return titles.map((title, idx) => ({ id: `mov_${idx+1}`, type: 'movie', name: title, description: `Фильм "${title}" по вселенной Толкина.`, phase: idx < 3 ? "Оригинальная трилогия" : (idx < 6 ? "Трилогия Хоббит" : "Анимационные"), year: 2001 + (idx % 20), userRating: 7 + (idx % 4), duration: 150 + (idx % 60), poster: getImageURL(200+idx, title, '#2a5f6b'), trailer: "#" }));
}
function generateBooks() {
    const titles = ["Сильмариллион","Неоконченные сказания","Дети Хурина","Берен и Лутиэн","Падение Гондолина","История Средиземья","Хоббит","Братство Кольца","Две крепости","Возвращение короля","Приложения","Письма","Атлас Средиземья","Энциклопедия Арды","Тень прошлого","Возвращение Тени","Измена Изенгарда","Кольцо Мордора","Война Кольца","Саурон Побеждённый","Падение Нуменора","Книга Утраченных Сказаний I","Книга Утраченных Сказаний II","Дорога в Среднеземье","Мифы и легенды"];
    const authors = ["Дж.Р.Р. Толкин","К. Толкин","Дж.Р.Р. Толкин","Дж.Р.Р. Толкин","Дж.Р.Р. Толкин","К. Толкин","Дж.Р.Р. Толкин","Дж.Р.Р. Толкин","Дж.Р.Р. Толкин","Дж.Р.Р. Толкин","Дж.Р.Р. Толкин","Х. Карпентер","К. Фонштадт","Р. Фостер","Дж.Р.Р. Толкин","Дж.Р.Р. Толкин","Дж.Р.Р. Толкин","Дж.Р.Р. Толкин","Дж.Р.Р. Толкин","Дж.Р.Р. Толкин","Дж.Р.Р. Толкин","Дж.Р.Р. Толкин","Дж.Р.Р. Толкин","Д. Дэй","Дж.Р.Р. Толкин"];
    return titles.map((title, idx) => ({ id: `book_${idx+1}`, type: 'book', name: title, author: authors[idx % authors.length], description: `Книга/комикс: ${title}.`, year: 1954 + (idx % 70), publisher: "Houghton Mifflin", issuesCount: Math.floor(Math.random() * 30) + 1, cover: getImageURL(300+idx, title, '#4a6a3b') }));
}
function saveToLocal() {
    localStorage.setItem('lotr_chars', JSON.stringify(appData.characters));
    localStorage.setItem('lotr_movies', JSON.stringify(appData.movies));
    localStorage.setItem('lotr_books', JSON.stringify(appData.books));
    localStorage.setItem('lotr_favs', JSON.stringify([...favorites]));
    localStorage.setItem('lotr_ratings', JSON.stringify(userRatings));
    localStorage.setItem('lotr_view', currentView);
}
function loadFromLocal() {
    const chars = localStorage.getItem('lotr_chars');
    const movs = localStorage.getItem('lotr_movies');
    const books = localStorage.getItem('lotr_books');
    const favs = localStorage.getItem('lotr_favs');
    const ratings = localStorage.getItem('lotr_ratings');
    const view = localStorage.getItem('lotr_view');
    appData.characters = chars ? JSON.parse(chars) : generateCharacters();
    appData.movies = movs ? JSON.parse(movs) : generateMovies();
    appData.books = books ? JSON.parse(books) : generateBooks();
    favorites = new Set(favs ? JSON.parse(favs) : []);
    userRatings = ratings ? JSON.parse(ratings) : {};
    if (view === 'list') currentView = 'list';
    else currentView = 'grid';
}
function notify(msg) {
    let toast = document.getElementById('toastContainer');
    let div = document.createElement('div');
    div.className = 'toast';
    div.innerText = msg;
    toast.appendChild(div);
    setTimeout(() => div.remove(), 2000);
}
function showModal(title, contentHtml, onConfirm) {
    const modal = document.getElementById('modalContainer');
    modal.innerHTML = `<div class="modal-card"><h3>${title}</h3>${contentHtml}<div class="flex-between" style="margin-top:1rem"><button id="modalCancel">Отмена</button><button id="modalConfirm" class="primary">Ок</button></div></div>`;
    modal.classList.add('active');
    document.getElementById('modalCancel').onclick = () => modal.classList.remove('active');
    const confirmBtn = document.getElementById('modalConfirm');
    if (onConfirm) confirmBtn.onclick = () => { onConfirm(); modal.classList.remove('active'); };
    else confirmBtn.onclick = () => modal.classList.remove('active');
}
function renderHome() {
    const stats = { chars: appData.characters.length, movies: appData.movies.length, books: appData.books.length };
    const randomFact = "🧙 Гэндальф — это майар, а его первоначальное имя — Олорин.";
    const popular = appData.characters.slice(0, 6);
    const slider = popular.map(c => `<div class="card" style="min-width:180px"><img class="card-img" src="${c.image}" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'150\\' viewBox=\\'0 0 200 150\\'%3E%3Crect width=\\'200\\' height=\\'150\\' fill=\\'%238b5a2b\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'white\\' font-size=\\'20\\' font-family=\\'Georgia\\'%3E${encodeURIComponent(c.name.slice(0, 10))}%3C/text%3E%3C/svg%3E';"><div class="card-body">${c.name}</div></div>`).join('');
    document.getElementById('mainContent').innerHTML = `<h1>Добро пожаловать в Ардапедию!</h1><div class="progress-bar"><div class="progress-fill"></div></div><p><em>${randomFact}</em></p><div style="display:flex; gap:2rem; margin:1rem 0"><div>📖 Персонажей: ${stats.chars}</div><div>🎬 Фильмов: ${stats.movies}</div><div>📚 Книг: ${stats.books}</div></div><h3>⭐ Популярные персонажи</h3><div style="display:flex; gap:1rem; overflow-x:auto; padding:1rem 0">${slider}</div>`;
}
function renderCharacters() {
    let filtered = appData.characters.filter(c => c.name.toLowerCase().includes(currentFilters.search.toLowerCase()));
    if (currentFilters.team) filtered = filtered.filter(c => c.team === currentFilters.team);
    if (currentFilters.status) filtered = filtered.filter(c => c.status === currentFilters.status);
    if (currentFilters.sortBy === 'name') filtered.sort((a,b)=>a.name.localeCompare(b.name));
    if (currentFilters.sortBy === 'year') filtered.sort((a,b)=>a.firstAppearance - b.firstAppearance);
    if (currentFilters.sortBy === 'power') filtered.sort((a,b)=>b.powerLevel - a.powerLevel);
    const cardsHtml = filtered.map(c => `<div class="card" data-id="${c.id}" data-type="character"><img class="card-img" src="${c.image}" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'150\\' viewBox=\\'0 0 200 150\\'%3E%3Crect width=\\'200\\' height=\\'150\\' fill=\\'%236b4c2b\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'white\\' font-size=\\'20\\' font-family=\\'Georgia\\'%3E${encodeURIComponent(c.name.slice(0, 15))}%3C/text%3E%3C/svg%3E';"><div class="card-body"><span class="favorite-star" data-id="${c.id}" data-type="character">${favorites.has(c.id) ? '★' : '☆'}</span><div class="card-title">${c.name}</div><div>${c.team} • ${c.status}</div><div>⚔️ Сила: ${c.powerLevel}</div><button class="details-btn" data-id="${c.id}" data-type="character">Подробнее</button></div></div>`).join('');
    const toolbar = `<div class="toolbar"><input type="text" id="searchInput" placeholder="Поиск..." class="search-input" value="${currentFilters.search}"><select id="teamFilter"><option value="">Все команды</option>${[...new Set(appData.characters.map(c=>c.team))].map(t=>`<option ${currentFilters.team===t?'selected':''}>${t}</option>`).join('')}</select><select id="statusFilter"><option value="">Все статусы</option><option ${currentFilters.status==='герой'?'selected':''}>герой</option><option ${currentFilters.status==='злодей'?'selected':''}>злодей</option><option ${currentFilters.status==='антигерой'?'selected':''}>антигерой</option></select><select id="sortSelect"><option value="">Сортировка</option><option value="name">По имени</option><option value="year">По году</option><option value="power">По силе</option></select><button id="gridViewBtn">📱 Сетка</button><button id="listViewBtn">📄 Список</button></div><div class="${currentView === 'list' ? 'list-view' : ''}"><div class="cards-grid">${cardsHtml || '<p>Ничего не найдено</p>'}</div></div>`;
    document.getElementById('mainContent').innerHTML = toolbar;
    attachCardEvents(); attachFilterEvents();
}
function renderMovies() {
    let filtered = appData.movies.filter(m => m.name.toLowerCase().includes(currentFilters.search.toLowerCase()));
    if (currentFilters.phase) filtered = filtered.filter(m => m.phase === currentFilters.phase);
    if (currentFilters.sortBy === 'rating') filtered.sort((a,b)=> (userRatings[a.id] || a.userRating) - (userRatings[b.id] || b.userRating));
    if (currentFilters.sortBy === 'year') filtered.sort((a,b)=> a.year - b.year);
    const cardsHtml = filtered.map(m => `<div class="card" data-id="${m.id}" data-type="movie"><img class="card-img" src="${m.poster}" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'150\\' viewBox=\\'0 0 200 150\\'%3E%3Crect width=\\'200\\' height=\\'150\\' fill=\\'%232a5f6b\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'white\\' font-size=\\'20\\' font-family=\\'Georgia\\'%3E${encodeURIComponent(m.name.slice(0, 15))}%3C/text%3E%3C/svg%3E';"><div class="card-body"><span class="favorite-star" data-id="${m.id}" data-type="movie">${favorites.has(m.id) ? '★' : '☆'}</span><div class="card-title">${m.name}</div><div>⭐ Рейтинг: ${userRatings[m.id] || m.userRating}/10</div><button class="rate-btn" data-id="${m.id}">Оценить</button><button class="details-btn" data-id="${m.id}" data-type="movie">Подробнее</button></div></div>`).join('');
    const toolbar = `<div class="toolbar"><input id="searchInput" placeholder="Поиск фильмов" value="${currentFilters.search}"><select id="phaseFilter"><option value="">Все фазы</option><option ${currentFilters.phase==='Оригинальная трилогия'?'selected':''}>Оригинальная трилогия</option><option ${currentFilters.phase==='Трилогия Хоббит'?'selected':''}>Трилогия Хоббит</option><option ${currentFilters.phase==='Анимационные'?'selected':''}>Анимационные</option></select><select id="sortMovies"><option value="">Сортировка</option><option value="rating">По рейтингу</option><option value="year">По году</option></select><button id="gridViewBtn">📱 Сетка</button><button id="listViewBtn">📄 Список</button></div><div class="${currentView === 'list' ? 'list-view' : ''}"><div class="cards-grid">${cardsHtml}</div></div>`;
    document.getElementById('mainContent').innerHTML = toolbar;
    attachRatingEvents(); attachCardEvents(); attachFilterEvents();
}
function renderBooks() {
    let filtered = appData.books.filter(b => b.name.toLowerCase().includes(currentFilters.search.toLowerCase()));
    if (currentFilters.sortBy === 'year') filtered.sort((a,b)=> a.year - b.year);
    const cardsHtml = filtered.map(b => `<div class="card" data-id="${b.id}" data-type="book"><img class="card-img" src="${b.cover}" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'150\\' viewBox=\\'0 0 200 150\\'%3E%3Crect width=\\'200\\' height=\\'150\\' fill=\\'%234a6a3b\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'white\\' font-size=\\'20\\' font-family=\\'Georgia\\'%3E${encodeURIComponent(b.name.slice(0, 15))}%3C/text%3E%3C/svg%3E';"><div class="card-body"><span class="favorite-star" data-id="${b.id}" data-type="book">${favorites.has(b.id) ? '★' : '☆'}</span><div class="card-title">${b.name}</div><div>${b.author} • Выпусков: ${b.issuesCount}</div><button class="details-btn" data-id="${b.id}" data-type="book">Подробнее</button></div></div>`).join('');
    const toolbar = `<div class="toolbar"><input id="searchInput" placeholder="Поиск книг" value="${currentFilters.search}"><select id="sortBooks"><option value="">Сортировка</option><option value="year">По году</option></select><button id="gridViewBtn">📱 Сетка</button><button id="listViewBtn">📄 Список</button></div><div class="${currentView === 'list' ? 'list-view' : ''}"><div class="cards-grid">${cardsHtml}</div></div>`;
    document.getElementById('mainContent').innerHTML = toolbar;
    attachCardEvents(); attachFilterEvents();
}
function renderFavorites() {
    const all = [...appData.characters, ...appData.movies, ...appData.books];
    const favs = all.filter(item => favorites.has(item.id));
    const html = `<h2>❤️ Избранное (${favs.length})</h2><div class="cards-grid">${favs.map(item => `<div class="card"><div class="card-body"><div class="card-title">${item.name}</div><button class="remove-fav" data-id="${item.id}">🗑️ Удалить</button><button class="details-btn" data-id="${item.id}" data-type="${item.type}">Подробнее</button></div></div>`).join('')}</div>`;
    document.getElementById('mainContent').innerHTML = html;
    document.querySelectorAll('.remove-fav').forEach(btn => { btn.onclick = () => { favorites.delete(btn.dataset.id); saveToLocal(); notify('Удалено из избранного'); renderFavorites(); }; });
    attachCardEvents();
}
function renderDashboard() {
    const html = `<h2>⚙️ Панель управления</h2><div style="display:flex; gap:1rem; flex-wrap:wrap; margin:1rem 0"><button id="addCharBtn">➕ Персонаж</button><button id="addMovieBtn">🎬 Фильм</button><button id="addBookBtn">📖 Книгу</button><button id="clearAllBtn">🗑️ Очистить всё</button><button id="exportBtn">📤 Экспорт</button><button id="importBtn">📥 Импорт</button><input type="file" id="importFile" style="display:none" accept=".json"></div><div><h3>Массовое удаление</h3><button id="massDelChars">Удалить всех персонажей</button> <button id="massDelMovies">Удалить все фильмы</button> <button id="massDelBooks">Удалить все книги</button></div>`;
    document.getElementById('mainContent').innerHTML = html;
    document.getElementById('addCharBtn').onclick = () => showModal('Новый персонаж', `<input id="newName" placeholder="Имя"><input id="newTeam" placeholder="Команда"><input id="newStatus" placeholder="Статус"><input id="newPower" placeholder="Сила">`, () => { appData.characters.push({ id: `char_${Date.now()}`, type:'character', name: document.getElementById('newName').value, team: document.getElementById('newTeam').value, status: document.getElementById('newStatus').value, powerLevel: +document.getElementById('newPower').value, firstAppearance:2024, image: getImageURL(999, document.getElementById('newName').value || 'Новый', '#6b4c2b'), abilities:'', description:''}); saveToLocal(); notify('Добавлен'); renderDashboard(); });
    document.getElementById('addMovieBtn').onclick = () => showModal('Новый фильм', `<input id="movName" placeholder="Название"><input id="movYear" placeholder="Год"><input id="movRating" placeholder="Рейтинг">`, () => { appData.movies.push({ id:`mov_${Date.now()}`, type:'movie', name: document.getElementById('movName').value, year: +document.getElementById('movYear').value, userRating:+document.getElementById('movRating').value, phase:'Новая', duration:120, poster: getImageURL(998, document.getElementById('movName').value || 'Фильм', '#2a5f6b'), trailer:''}); saveToLocal(); notify('Добавлен'); renderDashboard(); });
    document.getElementById('addBookBtn').onclick = () => showModal('Новая книга', `<input id="bookName" placeholder="Название"><input id="bookAuthor" placeholder="Автор"><input id="bookYear" placeholder="Год">`, () => { appData.books.push({ id:`book_${Date.now()}`, type:'book', name: document.getElementById('bookName').value, author: document.getElementById('bookAuthor').value, year:+document.getElementById('bookYear').value, publisher:'', issuesCount:1, cover: getImageURL(997, document.getElementById('bookName').value || 'Книга', '#4a6a3b')}); saveToLocal(); notify('Добавлена'); renderDashboard(); });
    document.getElementById('clearAllBtn').onclick = () => { localStorage.clear(); location.reload(); };
    document.getElementById('exportBtn').onclick = () => { const data = { characters:appData.characters, movies:appData.movies, books:appData.books, favorites:[...favorites], ratings:userRatings }; const blob = new Blob([JSON.stringify(data)], {type:'application/json'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'ardadata.json'; a.click(); };
    document.getElementById('importBtn').onclick = () => document.getElementById('importFile').click();
    document.getElementById('importFile').onchange = (e) => { const file = e.target.files[0]; const reader = new FileReader(); reader.onload = ev => { const data = JSON.parse(ev.target.result); appData.characters = data.characters || []; appData.movies = data.movies || []; appData.books = data.books || []; favorites = new Set(data.favorites || []); userRatings = data.ratings || {}; saveToLocal(); notify('Импорт успешен'); renderDashboard(); }; reader.readAsText(file); };
    document.getElementById('massDelChars').onclick = () => { appData.characters = []; saveToLocal(); renderDashboard(); notify('Персонажи удалены'); };
    document.getElementById('massDelMovies').onclick = () => { appData.movies = []; saveToLocal(); renderDashboard(); };
    document.getElementById('massDelBooks').onclick = () => { appData.books = []; saveToLocal(); renderDashboard(); };
}
function attachCardEvents() {
    document.querySelectorAll('.details-btn').forEach(btn => { btn.onclick = (e) => { e.stopPropagation(); const id = btn.dataset.id; const type = btn.dataset.type; let item; if (type === 'character') item = appData.characters.find(c=>c.id===id); else if (type === 'movie') item = appData.movies.find(m=>m.id===id); else item = appData.books.find(b=>b.id===id); if (item) showModal('Подробнее', `<p><strong>${item.name}</strong></p><p>${item.description}</p>${item.team ? `<p>Команда: ${item.team}</p>` : ''}${item.author ? `<p>Автор: ${item.author}</p>` : ''}`, null); }; });
    document.querySelectorAll('.favorite-star').forEach(star => { star.onclick = (e) => { e.stopPropagation(); const id = star.dataset.id; if (favorites.has(id)) favorites.delete(id); else favorites.add(id); saveToLocal(); notify(favorites.has(id) ? 'Добавлено в избранное' : 'Удалено из избранного'); renderPage(currentPage); }; });
}
function attachRatingEvents() {
    document.querySelectorAll('.rate-btn').forEach(btn => { btn.onclick = (e) => { e.stopPropagation(); const id = btn.dataset.id; showModal('Оценить фильм', `<input type="number" id="rateVal" min="1" max="10" step="1" placeholder="1-10">`, () => { const val = parseInt(document.getElementById('rateVal').value); if (val >= 1 && val <= 10) { userRatings[id] = val; saveToLocal(); notify(`Рейтинг ${val}/10 сохранён`); renderPage(currentPage); } else notify('Ошибка: введите число от 1 до 10'); }); }; });
}
function attachFilterEvents() {
    const search = document.getElementById('searchInput'); if (search) search.oninput = (e) => { currentFilters.search = e.target.value; renderPage(currentPage); };
    const team = document.getElementById('teamFilter'); if (team) team.onchange = (e) => { currentFilters.team = e.target.value; renderPage(currentPage); };
    const status = document.getElementById('statusFilter'); if (status) status.onchange = (e) => { currentFilters.status = e.target.value; renderPage(currentPage); };
    const sort = document.getElementById('sortSelect'); if (sort) sort.onchange = (e) => { currentFilters.sortBy = e.target.value; renderPage(currentPage); };
    const phase = document.getElementById('phaseFilter'); if (phase) phase.onchange = (e) => { currentFilters.phase = e.target.value; renderPage(currentPage); };
    const sortMov = document.getElementById('sortMovies'); if (sortMov) sortMov.onchange = (e) => { currentFilters.sortBy = e.target.value; renderPage(currentPage); };
    const sortBook = document.getElementById('sortBooks'); if (sortBook) sortBook.onchange = (e) => { currentFilters.sortBy = e.target.value; renderPage(currentPage); };
    const gridBtn = document.getElementById('gridViewBtn'); if (gridBtn) gridBtn.onclick = () => { currentView = 'grid'; saveToLocal(); renderPage(currentPage); };
    const listBtn = document.getElementById('listViewBtn'); if (listBtn) listBtn.onclick = () => { currentView = 'list'; saveToLocal(); renderPage(currentPage); };
}
function renderPage(page) {
    currentPage = page;
    if (page === 'home') renderHome();
    else if (page === 'characters') renderCharacters();
    else if (page === 'movies') renderMovies();
    else if (page === 'books') renderBooks();
    else if (page === 'favorites') renderFavorites();
    else if (page === 'dashboard') renderDashboard();
    document.querySelectorAll('.nav-item').forEach(nav => { if (nav.dataset.page === page) nav.classList.add('active'); else nav.classList.remove('active'); });
}
function initTheme() {
    const saved = localStorage.getItem('lotr_theme');
    if (saved === 'dark') document.body.classList.add('dark');
    document.getElementById('themeToggle').onclick = () => { document.body.classList.toggle('dark'); localStorage.setItem('lotr_theme', document.body.classList.contains('dark') ? 'dark' : 'light'); };
}
function init() {
    loadFromLocal(); initTheme();
    document.querySelectorAll('.nav-item').forEach(nav => { nav.onclick = () => { renderPage(nav.dataset.page); if (window.innerWidth <= 768) document.getElementById('sidebar').classList.add('closed'); }; });
    document.getElementById('burgerBtn').onclick = () => { document.getElementById('sidebar').classList.toggle('closed'); };
    renderPage('home');
}
window.addEventListener('DOMContentLoaded', init);