# robins-mask.js
Yet another jQuery mask input plugin.

## Description
This unobtrusive plugin adds a mask to the field so it is easier for the user to type in values. By default there are
three types of masks - numeric, alpha and alphanumeric.  You can add an additional type as well. I'll show you an example below. This plugin handles fixed width masks (SSN, phone, etc.) and also numeric masks (which is basically dynamically adding the comma between)

## Data Attributes
Attribute | Description          
--- | ---
data-mask-input | This attribute is where you would define your mask on the field.
data-mask-input-def | This optional attribute holds the JSON object that defines your new definition The definition should have a character key and regular expression.
data-mask-keep | This optional attribute allows you to preserve the mask on validation and form submission.

## Examples
```html
<input type="text" name="phone" data-mask-input="(999) 999-9999">
```
This simple example masks a phone number field.
```html
<input type="text" name="ssn"
        data-mask-input="(***) ***-9999"
        data-mask-input-def="{"*":"\\*|[0-9]" }""
        data-mask-keep="true">
```
This mask example allows asterisks and numbers on the first six numbers of an SSN number. Again you can add any character you like. In this case we had to escape the asterisk for the regex to work correctly.     

## Author
Andrew Keym 
@optimus_keym
http://github.com/keymholio

## License
Copyright © 2013 Free Software Foundation, Inc. License  GPLv3+:  GNU
GPL version 3 or later <http://gnu.org/licenses/gpl.html>.
This  is  free  software:  you  are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

