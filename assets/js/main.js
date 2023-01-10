showPage();
function showPage() {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const main = document.querySelector('main');
    const preloader = document.querySelector('.preloader');
    const about = document.querySelector('.about');
    let header_out = '';
    let footer_out = '';
    let about_out = '';



    function get_num(num) {
        return num = (+num < 9) ? ('0' + (+num + 1)) : +num + 1;
    }
    function get_info(input) {
        let output = '';
        for (let i = 0; i < input.length; i++) {
            output += '<p>' + input[i] + '</p>';
        }
        return output;
    }
    function get_contributors(input) {
        let output = '';
        for (let i = 0; i < input.length; i++) {
            output += '<p>' + input[i][0] + ' <span>' + input[i][1] + '</span></p>'
        }
        return output;
    }


    for (key in projects) {
        if (projects[key].name == main.getAttribute('data-name')) {
            let last = Number(Object.keys(projects).length - 1);
            let next = (+key == last) ? 0 : +key + 1;

            if (preloader.getAttribute('data-content') == 'video') {
                preloader.style.backgroundImage = 'url("../../content/images/' + projects[key].content[0] + '")';
            }

            header_out += '<a href="../../index.html" class="back_btn"><span></span> all projects</a>';
            header_out += '<h2>' + projects[key].name + '<span> .' + get_num(key) + '</span></h2>';
            header_out += '<a href="' + projects[key].link + '" class="visit_btn" target="_blank">visit site</a>';

            about_out += '<div class="about_box about_notes_box">';
            about_out += '<h4>notes</h4>';
            about_out += get_info(projects[key].about.notes);
            about_out += '</div>';
            about_out += '<div class="about_box contributors_box">';
            about_out += '<h4>contributors</h4>';
            about_out += get_contributors(projects[key].about.contributors);
            about_out += '</div>';
            about_out += '<div class="about_box info_box">';
            about_out += '<h4>' + projects[key].name + ' info</h4>'
            about_out += get_info(projects[key].about.info);
            about_out += '</div>';

            footer_out += '<a href="../' + projects[next].name +'" class="next_project">'
            footer_out += '<h2>' + projects[next].name + '<span> .' + get_num(next) + '</span></h2>'
            footer_out += '<div style="background-image: url(../../content/images/' + projects[next].content[0] + ')"></div></a>'

            header.innerHTML = header_out;
            about.innerHTML = about_out;
            footer.innerHTML = footer_out;

            break;
        }
    }
}