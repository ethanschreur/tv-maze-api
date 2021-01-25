/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
	// TODO: Make an ajax request to the searchShows api.  Remove
	// hard coded data.
	const data = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
	let result = [];
	for (let show of data.data) {
		const showMap = {};
		showMap.id = show.show.id;
		console.log(show.show.id);
		showMap.name = show.show.name;
		showMap.summary = show.show.summary;
		show.show.image === null
			? (showMap.image = 'https://tinyurl.com/tv-missing')
			: (showMap.image = show.show.image.original);
		result.push(showMap);
	}
	return result;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
	const $showsList = $('#shows-list');
	$showsList.empty();

	for (let show of shows) {
		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src=${show.image}>
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button type="button" class="btn-primary episodes">Episodes</button>
           </div>
         </div>
       </div>
      `
		);

		$showsList.append($item);
	}
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
	evt.preventDefault();

	let query = $('#search-query').val();
	if (!query) return;

	$('#episodes-area').hide();

	let shows = await searchShows(query);

	populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
	// TODO: get episodes from tvmaze
	//       you can get this by making GET request to
	//       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
	const episodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
	const episodesData = [];
	for (let eps of episodes.data) {
		const epData = {};
		epData.id = eps.id;
		epData.name = eps.name;
		epData.season = eps.season;
		epData.number = eps.number;
		episodesData.push(epData);
	}
	return episodesData;
	// TODO: return array-of-episode-info, as described in docstring above
}

async function populateEpisodes(epsArr) {
	const epsList = document.querySelector('#episodes-list');
	console.log(epsList);
	for (let ep of epsArr) {
		const li = document.createElement('li');
		li.innerHTML = `${ep.name} (season ${ep.season}, number ${ep.number})`;
		epsList.append(li);
	}
	document.querySelector('#episodes-area').setAttribute('style', '');
}
document.querySelector('.container').addEventListener('click', async function(event) {
	console.log(event.target);
	if ($(event.target).hasClass('episodes')) {
		populateEpisodes(await getEpisodes(event.target.parentElement.parentElement.getAttribute('data-show-id')));
	}
});
