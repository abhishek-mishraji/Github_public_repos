// function fetchRepos() {

//     const username = document.getElementById('username').value;
//     axios.get(`https://api.github.com/users/${username}/repos`)

//         .then(response => {
//             const repos = response.data;
//             const repoList = document.getElementById('repoList');
//             repoList.innerHTML = '';
//             for (let repo of repos) {
//                 const listItem = document.createElement('li');
//                 listItem.textContent = repo.name;
//                 repoList.appendChild(listItem);
//             }
//         })
//         .catch(error => console.error('Error:', error));
// }
// *******************************************************************


let currentPage = 1;
let cache = {};
function fetchRepos() {
    const username = document.getElementById('username').value;
    const pageSize = document.getElementById('pageSize').value;
    const cacheKey = `${username}-${pageSize}-${currentPage}`;

    if (cache[cacheKey]) {
        displayRepos(cache[cacheKey]);
    } else {
        document.getElementById('loader').style.display = 'block';
        axios.all([
            axios.get(`https://api.github.com/users/${username}`),
            axios.get(`https://api.github.com/users/${username}/repos?per_page=${pageSize}&page=${currentPage}`)
        ])
            .then(axios.spread((userResponse, reposResponse) => {
                cache[cacheKey] = { user: userResponse.data, repos: reposResponse.data };
                displayRepos(cache[cacheKey]);
            }))
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
                document.getElementById('loader').style.display = 'none';
            });
    }
}

function displayRepos(data) {
    const user = data.user;
    const repos = data.repos;

    document.getElementById('profile').innerHTML = `
        <img src="${user.avatar_url}" alt="${user.name}'s avatar" width="50" height="50">
        <h2>Hi, ${user.name}</h2>
        <p>Well Done! Genius: ${user.public_repos}</p>
    `;

    const repoList = document.getElementById('repoList');
    repoList.innerHTML = '';
    repos.forEach(repo => {
        const div = document.createElement('div');
        const a = document.createElement('a');
        a.href = repo.html_url;
        a.textContent = repo.name;
        div.appendChild(a);
        const desc = document.createElement('p');
        desc.textContent = repo.description;
        div.appendChild(desc);
        const lang = document.createElement('p');
        lang.textContent = `Language: ${repo.language}`;
        lang.className = 'lang';
        div.appendChild(lang);

        repoList.appendChild(div);
    });
}