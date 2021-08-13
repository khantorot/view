function get_num(num) {
    return num = (+num < 10) ? ('0' + (+num + 1)) : +num + 1;
}

showProjects();
function showProjects() {
    let project_out = '';
    let name;
    for (key in projects) {
        name = projects[key].name.replace(/\s/g, '');
        project_out += '<div class="project" data-size="' + projects[key].size + '">';
        project_out += '<div class="content_wrapper"><a href="./projects/' + name + '/' + name + '.html" class="wrap_link">';
        project_out += '<img src="./content/images/' + projects[key].content + '.gif">';
        project_out += '<img src="./content/images/' + projects[key].content + '.jpg">';
        project_out += '</a></div>';
        project_out += '<div class="project_panel">';
        project_out += '<a href="./projects/' + name + '/' + name + '.html" class="project_panel_link">' + projects[key].name + '<span> .' + get_num(key) + '</span></a>';
        project_out += '<a href="' + projects[key].link + '" class="project_link" target="_blank"><span></span></a>';
        project_out += '</div>';
        project_out += '</div>';
    }
    document.querySelector('.projects').innerHTML = project_out;
}

let project = document.querySelectorAll('.project');
let filter_elem = document.querySelectorAll('.filter_elem');

document.querySelector('.filter').addEventListener('click', function (e) {
    if (e.target.classList.contains('filter_elem_active')) {
        e.target.classList.remove('filter_elem_active');
        for (key in projects) {
            project[key].classList.remove('hide_project');
        }
    } else if (e.target.classList.contains('filter_elem')) {
        for (key in projects) {
            project[key].classList.add('hide_project');

            for (let i = 0; i < projects[key].category.length; i++) {
                if (projects[key].category[i] == e.target.innerHTML) {
                    project[key].classList.remove('hide_project');
                }
            }
        }
        filter_elem.forEach(element => {
            element.classList.remove('filter_elem_active')
        });
        e.target.classList.add('filter_elem_active');
    }
})

document.querySelector('#search').addEventListener('keyup', function () {
    let filter = this.value.toLowerCase();
    let visible_projects = 0;
    for (key in projects) {
        const string = projects[key].name;

        project[key].classList.add('hide_project');
        if (string.includes(filter) || filter == '') {
            project[key].classList.remove('hide_project');
            visible_projects++;
        }
    }
    if (visible_projects == 0) {
        document.querySelector('.projects').style.height = 69 + 'vh';
        document.querySelector('.not_found').classList.add('not_found_show');
    } else {
        document.querySelector('.projects').style.height = 'auto';
        document.querySelector('.not_found').classList.remove('not_found_show');
    }
    if (!mob) { new SmoothScroll().setSize }
})

document.addEventListener('click', function (e) {
    if (!(e.target.classList.contains('filter_elem'))) {
        filter_elem.forEach(element => {
            element.classList.remove('filter_elem_active')
        });
        for (key in projects) {
            project[key].classList.remove('hide_project');
        }
        document.querySelector('.not_found').classList.remove('not_found_show');
    }
    if (!mob) { new SmoothScroll().setSize }
})


document.querySelector('.back_to_top_btn').addEventListener('click', function () {
    scrollTo(document.documentElement, 0, 2000);
})

document.querySelector('.go_to_projects_btn').addEventListener('click', goToProjects);
document.querySelector('.filter_catolog').addEventListener('click', goToProjects);
document.querySelector('#search').addEventListener('click', goToProjects);

function goToProjects() {
    let hvalue = (mob) ? winsize.height - 200 : winsize.height;
    scrollTo(document.documentElement, hvalue, 700);
}