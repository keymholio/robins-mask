module("Fixed Mask");

test("Test if the mask is being filled in when typing", function() {
    event = $.Event("keypress");
    event.keyCode = event.which = 49;
    $('#phone').trigger(event);
    event.keyCode = event.which = 50;
    $('#phone').trigger(event);
    event.keyCode = event.which = 51;
    $('#phone').trigger(event);
    equal($('#phone').val(), "(123) ___-____", "Phone mask has characters - (123) ___-____");
});

test("Test inserting characters between existing characters", function() {
    event = $.Event("keypress");
    event.keyCode = event.which = 49;
    $('#phone').trigger(event);
    event.keyCode = event.which = 50;
    $('#phone').trigger(event);
    event.keyCode = event.which = 51;
    $('#phone').trigger(event);
    $('#phone').data('mask').caret(2);
    event.keyCode = event.which = 52;
    $('#phone').trigger(event);
    equal($('#phone').val(), "(142) 3__-____", "Inserted a '4' between the '1' and '2' - (142) 3__-____");
});

test("Test inserting a character over a range of characters", function() {
    $('#phone').val("1234567890");
    $('#phone').mask("insert_range");
    $('#phone').data('mask').caret(0,4); //selects a range of characters
    event = $.Event("keypress");
    event.keyCode = event.which = 49;
    $('#phone').trigger(event);
    equal($('#phone').val(), "(145) 678-90__", "Inserted a '1' in place of '123' of '(123) 456-7890' giving the result of (145) 678-90__");
});

test("Test inserting of upper and lowercase alpha characters", function() {
    event = $.Event("keypress");
    event.keyCode = event.which = 97;
    $('#alpha').trigger(event);
    event.keyCode = event.which = 66;
    event.shiftKey = true;
    $('#alpha').trigger(event);
    equal($('#alpha').val(), "aB_-___", "Inserted 'aB' into alpha mask - aB_-___");
});

test("Test inserting of upper and lowercase alpha characters and numbers", function() {
    event = $.Event("keypress");
    event.keyCode = event.which = 97;
    $('#alpha_numeric').trigger(event);
    event.keyCode = event.which = 66;
    event.shiftKey = true;
    $('#alpha_numeric').trigger(event);
    event.keyCode = event.which = 51;
    $('#alpha_numeric').trigger(event);
    equal($('#alpha_numeric').val(), "aB3/___", "Inserted 'aB3' into alpha numeric mask - aB3/___");
});

test("Test inserting characters with a custom mask (asterisk)", function() {
    event = $.Event("keypress");
    event.keyCode = event.which = 42;
    $('#ssn').trigger(event);
    equal($('#ssn').val(), "*__-__-____", "Inserted '*' into the custom SSN mask - *__-__-____");
});

test("Test that inserting characters without any space doesn't change the value", function() {
    $('#phone_with_value').mask('insert_range');
    event = $.Event("keypress");
    event.keyCode = event.which = 49;
    $('#phone_with_value').trigger(event);
    equal($('#phone_with_value').val(), "(123) 456-7890", "The original value '(123) 456-7890' remains when trying to add additional characters without any space");
});

test("Test if the mask is shown when clicked", function() {
    $('#phone').click();
    equal($('#phone').val(), "(___) ___-____", "Phone mask has placeholders - (___) ___-____");
});

test("Test if inserting a range of characters works (similar to a paste)", function() {
    $('#phone').val("1231231234");
    $('#phone').mask("insert_range");
    equal($('#phone').val(), "(123) 123-1234", "Phone mask has formatted a group of characters - (123) 123-1234");
});

test("Test if an empty mask is cleared when focus is lost", function() {
    $('#phone').click();
    $('#phone').blur();
    equal($('#phone').val(), "", "Phone mask has been cleared");
});

test("Test if the plugin keeps track of the current value", function() {
    event = $.Event("keypress");
    event.keyCode = event.which = 49;
    $('#phone').trigger(event);
    event.keyCode = event.which = 50;
    $('#phone').trigger(event);
    $('#phone').blur();
    equal($('#phone').val(), $('#phone').mask('get_value'), "Phone mask has the current value");
});

test("Test if characters are being deleted with backspace key", function() {
    $('#phone').val("1231231234");
    $('#phone').mask("insert_range");
    data = $('#phone').data('mask');
    data['caret'](4);
    event = $.Event("keydown");
    event.keyCode = event.which = 46;
    $('#phone').trigger(event);
    equal($('#phone').val(), "(123) 231-234_", "Phone mask deletes the '1' at caret position 4 - (123) 231-234_");
});

test("Test deleting a range of characters with the backspace key", function() {
    $('#phone').val("1234567890");
    $('#phone').mask("insert_range");
    $('#phone').data('mask').caret(0,4); //selects a range of characters
    event = $.Event("keydown");
    event.keyCode = event.which = 46;
    $('#phone').trigger(event);
    equal($('#phone').val(), "(456) 789-0___", "Deleted '123' from the phone number mask - (456) 789-0___)");
});

test("Test if characters are being deleted with delete key", function() {
    $('#phone').val("1234567890");
    $('#phone').mask("insert_range");
    data = $('#phone').data('mask');
    data['caret'](4);
    event = $.Event("keydown");
    event.keyCode = event.which = 8;
    $('#phone').trigger(event);
    equal($('#phone').val(), "(124) 567-890_", "Phone mask deletes the '3' at caret position 4 - (124) 567-890_");
});

test("Test if input with a value is formatted (similar to on load)", function() {
    $('#phone_with_value').mask('insert_range');
    equal($('#phone_with_value').val(), "(123) 456-7890", "Phone mask's value is formatted from 1234567890 to (123) 456-7890");
});

test("Test if optional value doesn't get masked", function() {
    equal($('#optional').val(), "optional", "Optional field stays the same");
});

test("Test if the masks are handled properly on submit", function() {
    $('form').on('submit', function (e){
        e.preventDefault();
    });
    $('form').submit();
    equal($('#date').val(), "01/09/1978", "The data-mask-keep attribute keeps the mask on submit - 01/09/1978");
    equal($('#phone_with_value').val(), "1234567890", "The phone number mask gets stripped - 1234567890");
});

module("Currency Mask");

test("Test if commas are added to a number when entered", function() {
    $('#number').val("10000");
    $('#number').blur();
    equal($('#number').val(), "10,000", "The number was masked to 10,000 from 10000");
});

test("Test if commas are removed when entering a number field", function() {
    $('#number_with_value').click();
    equal($('#number_with_value').val(), "10000", "Removed the number mask when entering the field - 10,000 to 10000");
});

test("Test if commas are added to a negative number when entered", function() {
    $('#number').val("-10000");
    $('#number').blur();
    equal($('#number').val(), "-10,000", "The number was masked to -10,000 from -10000");
});

test("Test if commas are added to a number with decimals when entered", function() {
    $('#number').val("10000.00");
    $('#number').blur();
    equal($('#number').val(), "10,000.00", "The number was masked to 10,000.00 from 10000.00");
});