function searchResultFormat(data) {
    let type = data['param'].split('_')[0]
    switch (type) {
        case 'city':
            let city = data.city_name;
            if (city === 'Калтан') {
                city = '&#9825; ' + city + ' &#9825;'
            }
            return city + ', ' + data.region_name + ', ' + data.country_name;
        case 'region':
            return data.region_name + ', ' + data.country_name;
        case 'country':
            return data.country_name;
    }
}
$(document).ready(function() {
    // Обработка клика на кнопку "Найти"
    $('#search-input').on('input', function() {
        let searchText = $(this).val();
        if (searchText !== '') {
            // Отправка запроса на сервер
            $.ajax({
                type: "POST",
                url: "/users/search",
                data: {
                    searchText: searchText
                },
                success: function(response) {
                    // Обработка ответа от сервера
                    let searchResults = response.data;
                    let html = '';
                    if (searchResults.length > 0) {
                        $.each(searchResults, function(index, value) {
                            html += '<div>' + value.param + ' --- ' + searchResultFormat(value) + '</div>';
                        });
                    } else {
                        html += '<div>Результаты не найдены</div>';
                    }
                    $('#search-results').html(html);
                },
                error: function(xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        }
    });
});

var timeout = null;
var activeIndex = 0;
function search(event) {
    var value = event.target.value;

    // Abort previous request
    if (event.keyCode !== 13) {
        clearTimeout(timeout);
    }

    if (event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 13) {
        return;
    }

    // Send new request
    if (value.length > 0) {
        timeout = setTimeout(function(){
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    showResults(JSON.parse(xhr.responseText));
                }
            };
            var body = 'searchText=' + encodeURIComponent(value);


            xhr.open('POST', '/users/search', true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.send(body);
        }, 300); // Wait 300ms before sending request
    } else {
        hideResults();
    }
}


function showResults(results) {
    var container = document.getElementById('result-container');
    container.innerHTML = '';
    results = results.data

    for (var i = 0; i < results.length; i++) {
        var div = document.createElement('div');
        div.id = 'result_' + results[i].id;
        div.className = 'result';
        div.setAttribute('data-param', results[i].param);
        div.setAttribute('data-name', searchResultFormat(results[i]));
        div.innerHTML = searchResultFormat(results[i]);
        div.addEventListener('click', selectResult);

        // Add mouseenter event to set active class
        div.addEventListener('mouseenter', function() {
            var elements = container.querySelectorAll('.result');
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove('active');
            }
            this.classList.add('active');

            for (i = 0; i < elements.length; i++) {
                if (elements[i].classList.contains('active')) {
                    activeIndex = i;
                    break;
                }
            }

        });
        container.appendChild(div);
    }
    container.style.display = results.length ? 'block' : 'none';
    // Add mouseleave event to remove active class


    var firstResult = container.querySelector('.result');
    if (firstResult) {
        activeIndex = 0
        firstResult.classList.add('active');
    }
}

function hideResults() {
    var container = document.getElementById('result-container');
    container.innerHTML = '';
    container.style.display = 'none';
}

function selectResult(event) {
    var param = event.target.dataset.param;
    var name = event.target.dataset.name
    document.getElementById('hidden-input').value = param;
    document.getElementById('input-text').value = name;
    hideResults();
}

document.addEventListener('keydown', function(event) {
    var active = document.getElementsByClassName('active')[0];

    var elements = document.querySelectorAll('.result');
    var maxIndex = elements.length - 1;

    if (event.keyCode === 40) { // down arrow
        event.preventDefault();
        if (activeIndex < maxIndex) {
            elements[activeIndex].classList.remove('active');
            activeIndex++;
            elements[activeIndex].classList.add('active');

            // Scroll to element if it's not in view
            scrollToElement(elements[activeIndex]);
        }
    } else if (event.keyCode === 38) { // up arrow
        event.preventDefault();
        if (activeIndex > 0) {
            elements[activeIndex].classList.remove('active');
            activeIndex--;
            elements[activeIndex].classList.add('active');

            // Scroll to element if it's not in view
            scrollToElement(elements[activeIndex]);
        }
    } else if (event.keyCode === 13 && active) { // Enter
        selectResult({target: active});
    }
});

function scrollToElement(element) {
    // Scroll to element if it's not in view
    var container = document.getElementById('result-container');
    var scrollPosition = container.scrollTop;
    var elementPosition = element.offsetTop;
    var elementHeight = element.offsetHeight;
    var containerHeight = container.offsetHeight;

    if (elementPosition < scrollPosition) {
        container.scrollTop = elementPosition;
    } else if (elementPosition + elementHeight > scrollPosition + containerHeight) {
        container.scrollTop = elementPosition + elementHeight - containerHeight;
    }
}

document.addEventListener('click', function(event) {
    if (!event.target.matches('.result') && !event.target.matches('#input-text')) {
        hideResults();
    }
});