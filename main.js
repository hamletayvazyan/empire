$(document).ready(function () {
    var canMove = false;
    var clonedItems = 0;
    var clickCount = 0;
    var itemId;
    var selectedItemParent;
    var initialTimer = setTimeout(function initial() {
        $('.run').each(function (i, e) {
            let count = +$(this).attr('data-count');
            count++;
            $(this).attr('data-count', count);
        });
        initialTimer = setTimeout(initial, 1000);
    }, 1000);

    function selectItemToMove(selected) {
        // console.log('first action');
        if (canMove) return;
        selectedItemParent = $(selected).parent();
        clonedItems += 1;
        itemId = 'item' + clonedItems;
        let classNames = $(selected).attr('class');
        $('<span/>', {
            class: classNames,
            id: itemId
        }).appendTo('body');
        // $('#' + itemId).css({top: e.pageY, left: e.pageX});
        canMove = true;
    }

    function appendAction(selectedArea) {
        // console.log('second action');
        const createdItem = $('#' + itemId);
        const divide = +selectedItemParent.attr('data-count') % 2 === 0 ? +selectedItemParent.attr('data-count') / 2 : (+selectedItemParent.attr('data-count') + 1) / 2;
        selectedItemParent.attr('data-count', divide);
        if (selectedArea) {
            if (!selectedArea.hasClass('run')) {
                selectedArea.removeClass('active-border');
                selectedArea.append(createdItem);
                selectedArea.addClass('run');
                if (selectedItemParent.attr('id')) {
                    selectedArea.attr('data-prop', selectedItemParent.attr('id'));
                } else {
                    selectedArea.attr('data-prop', selectedItemParent.data('prop'));
                }
                if (!selectedArea.attr('data-count')) {
                    selectedArea.attr('data-count', divide);
                } else {
                    const increment = +selectedArea.attr('data-count') + divide;
                    selectedArea.attr('data-count', increment);
                }
            } else {
                if (createdItem.attr('class') === selectedArea.children('span').attr('class')) {
                    const increment = +selectedArea.attr('data-count') + divide;
                    selectedArea.attr('data-count', increment);
                    createdItem.remove();
                } else {
                    let decrement = +selectedArea.attr('data-count') - divide;
                    switch (true) {
                        case decrement >= 0:
                            selectedArea.attr('data-count', decrement)
                            createdItem.remove();
                            break;
                        case decrement < 0:
                            decrement = -decrement;
                            selectedArea.attr('data-count', decrement);
                            selectedArea.html(createdItem);
                            if (selectedItemParent.attr('id')) {
                                selectedArea.attr('data-prop', selectedItemParent.attr('id'));
                            } else {
                                selectedArea.attr('data-prop', selectedItemParent.data('prop'));
                            }
                            break;
                    }
                }
            }
        } else {
            createdItem.remove();
        }
        if ($(selectedArea).hasClass('active-border')) {
            $(selectedArea).removeClass('active-border');
        }
        canMove = false;
        selectedItemParent = undefined;
        clickCount = 0;
    }

    $('.initial').on({
        click: function (e) {
            e.preventDefault();
            clickCount+=1;
            if ($(this).find('span').length > 0 && clickCount === 1) {
                selectItemToMove($(this).children('span'));
            } else {
                appendAction($(this));
            }
        },
        mouseenter: function (e) {
            e.preventDefault();
            if (!canMove) return;
            $(this).addClass('active-border');
        },
        mouseleave: function (e) {
            e.preventDefault();
            if (!canMove) return;
            $(this).removeClass('active-border');
        }
    })
})
