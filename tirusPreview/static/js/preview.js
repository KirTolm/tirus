$(function() {
    $('.newpostButton').click(function() {
        $('#newpost').slideToggle(500);
    });
});

$(function() {
    $('.changeButton').click(function() {
        $('#change').slideToggle(500);
    });
});

function postDelete(post_id) {
    if (confirm('Вы уверены, что хотите удалить?')) {

        var url = 'delete/' + post_id;
        $('.postDelete').attr('href', url);
    } else {
        $('.postDelete').removeAttr('href');
    };
};

function postEdit(post_id) {
    var idPost = '#' + post_id;
    var idTitle = '.postTitle-' + post_id;
    var idContent = '.postContent-' + post_id;

    var oldTitle = $(idTitle).text();
    var oldContent = $(idContent).html();

    var editUrl = 'edit/' + post_id;
    var cancellFunc = "postCancell(" + post_id + ", " + "'" + oldTitle + "'" + ", " + "'"  + oldContent + "'" + ");";

    var cancellIcon = $('<span class="glyphicon glyphicon-arrow-left"></span>').attr('onclick', cancellFunc);
    var cancellButton = $('<a class="postCancell" title="Отмена"></a>').html(cancellIcon);
    var cancellButtons = $('<div class="postButtons"></div>').append(cancellButton);

    var formTitle = $('<input required type="text" size=30 class="form-control" name="title" id="form-addEntry-Title">').attr('value', oldTitle);
    var formContent = $('<textarea required class="form-control" name="content" rows=5 cols=40 id="form-addEntry-Text"></textarea>').text(oldContent);

    var editTitle = $('<h2 class="form-addEntry-Title"></h2>').text('Редактировать:');
    var termTitle = $('<dt></dt>').text('Заголовок:');
    var defTitle = $('<dd></dd>').html(formTitle);
    var termContent = $('<dt></dt>').text('Код вставки плеера:');
    var defContent = $('<dd></dd>').html(formContent);
    var formButton = $('<button class="btn btn-large btn-primary" type="submit"></button>').text('Редактировать');

    var defList = $('<dl></dl>').append(termTitle, defTitle, termContent, defContent, formButton);
    var formTemp = $('<form method="post" class="form-addEntry"></form>').attr('action', editUrl);
    var formEd = $(formTemp).html(editTitle);
    var formEdit = $(formEd).append(defList);
    var divEdit = $('<div class="form-group" id="postedit"></div>').html(formEdit);


    $(idPost).html(cancellButtons);
    $(idPost).append(divEdit);

};

function postCancell(post_id, oldTitle, oldContent) {
    var idPost = '#' + post_id;
    var idTitle = 'postTitle-' + post_id;
    var idContent = 'postContent-' + post_id;

    var editFunc = "postEdit(" + post_id + ");";
    var deleteUrl = 'delete/' + post_id;
    var deleteFunc = "postDelete(" + deleteUrl + ");";

    var editIcon = $('<span class="glyphicon glyphicon-pencil"></span>').attr('onclick', editFunc);
    var editButton = $('<a class="postEdit" title="Редактировать"></a>').html(editIcon);
    var deleteIcon = $('<span class="glyphicon glyphicon-remove"></span>').attr('onclick', deleteFunc);
    var deleteButton = $('<a class="postDelete" title="Удалить"></a>').html(deleteIcon);
    var postButtons = $('<div class="postButtons"></div>').append(editButton, deleteButton);

    var postTitle = $('<h2 id="postTitle"></h2>').attr('class', idTitle);
    var postTitle = $(postTitle).text(oldTitle);

    var postContent = $("<div id='postContent'></div").attr('class', idContent);
    var postContent = $(postContent).html(oldContent);

    $(idPost).html(postButtons);
    $(idPost).append(postTitle, postContent);
};