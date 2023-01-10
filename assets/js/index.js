function get_num(num) {
    return num = (+num < 9) ? ('0' + (+num + 1)) : +num + 1;
}

showProjects();
function showProjects() {
    let project_out = '';
    let name;
    for (key in projects) {
        name = projects[key].name.replace(/\s/g, '');
        project_out += '<div class="project" data-size="' + projects[key].size + '">';
        project_out += '<div class="content_wrapper"><a href="./projects/' + name + '" class="wrap_link">';
        project_out += '<img src="./content/images/' + projects[key].content[0] + '">';
        project_out += '<img src="./content/images/' + projects[key].content[1] + '">';
        project_out += '</a></div>';
        project_out += '<div class="project_panel">';
        project_out += '<a href="./projects/' + name + '" class="project_panel_link">' + projects[key].name + '<span> .' + get_num(key) + '</span></a>';
        project_out += '<a href="' + projects[key].link + '" class="project_link" target="_blank"><span></span></a>';
        project_out += '</div>';
        project_out += '</div>';
    }
    document.querySelector('.projects').innerHTML = project_out;
}

showCatalog();

function showCatalog() {
    let filter_out = '';

    catalog.forEach(element => {
        filter_out += '<span class="filter_elem">'+ element +'</span>';
    });

    document.querySelector('.filter_catolog').innerHTML = filter_out;
}




let project = document.querySelectorAll('.project');
let filter_elem = document.querySelectorAll('.filter_elem');

document.querySelector('.filter').addEventListener('click', function (e) {
    if (e.target.classList.contains('filter_elem_active')) {
        e.target.classList.remove('filter_elem_active');

        project.forEach(element => {
            element.classList.remove('hide_project');
        });

    } else if (e.target.classList.contains('filter_elem')) {
        let visible_projects = 0;
        
        for (key in projects) {
            project[key].classList.add('hide_project');

            projects[key].category.forEach(element => {
                if(element == e.target.innerHTML) {
                    project[key].classList.remove('hide_project');
                    visible_projects++;
                }
            });
            if (visible_projects == 0) {
                document.querySelector('.not_found').classList.add('not_found_show');
            } else {
                document.querySelector('.not_found').classList.remove('not_found_show');
            }
        }
        filter_elem.forEach(element => {
            element.classList.remove('filter_elem_active')
        });
        e.target.classList.add('filter_elem_active');

        goToProjects();
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
        document.querySelector('.not_found').classList.add('not_found_show');
    } else {
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
document.querySelector('#search').addEventListener('click', function(){
    if(!mob){
        goToProjects();
    }
});

function goToProjects() {
    let hvalue = (mob) ? 66 * winsize.height / 100 : winsize.height;
    scrollTo(document.documentElement, hvalue, 500);
}



window.addEventListener('load', function(){
    setTimeout(function () {
        getPageYScroll();
        if (mob == false && scroll_checker == 0) {
            scrollTo(document.documentElement, winsize.height, 1000);
        }
    }, 5000);
    
})
