// call /get-manifests

function getManifests() {
    // fetch the manifests.json files from the server
    fetch('get-manifests')
        .then(response => response.json())
        .then(data => {
            let isDark = false;
            data.forEach(project => {
                createCard(project, isDark);
                isDark = !isDark;

            });
        })
        .catch(error => console.error('Error fetching manifests:', error));
}

function createCard(project, isDark) {
    const card = document.createElement('div');
    card.className = `project-card ${isDark ? 'dark-card' : 'light-card'}`;
    card.innerHTML = `
        <div class="project-image">
            <img src="${project.project_image}" alt="${project.project_name}">
        </div>
        <div class="project-content">
            <div class="project-header">
                <h2 class="project-title">${project.project_name}</h2>
                <p class="project-date">
                    <span class="date">
                        ${project.project_date}
                    </span>    
                </p>
            </div>
            <p class="project-links">
                <a href="${project.github_link}" class="github-button" >${project.github_link}</a>
            </p>
            <p class="project-description">
                ${project.project_description}
            </p>
            <a href="${project.live_demo}" class="demo-button" >Demo en ligne</a>
        </div>`

    const projectsContainer = document.querySelector('.projects-container');
    projectsContainer.appendChild(card);

}


getManifests();