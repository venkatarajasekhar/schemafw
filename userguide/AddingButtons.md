# Adding Buttons

HTML buttons are a common way to provide access to features in web pages.  SchemaFW
provides the easy addition of some default buttons in special contexts.  This guide
will list these default button types below, but also remember that you can create
custom pages to enhance your web page with other interaction models.

## Button Locations

The default location for additional buttons is at the top of a page or dialog/form.
The buttons will be listed in-line in the same order as they are listed in the SRM
file.

## Adding Buttons to SRM Response Modes

Buttons can be added to schemas either individually or as a group.  Grouped buttons
are rendered together and separated with vertical space from buttons or button groups
that come before or after.

Sets of individual buttons will be rendered as groups.  An intervening button group
within a set of individual buttons will result in the buttons before and/or after
the button group to be rendered as separate button groups.

### Button Instructions

Each button type includes at least two instructions, the **type** and an action
instruction to perform upon clicking the button.  In practice, buttons also include
a **label** instruction to alert the user to the purpose of the button.

The action instruction can be of these types,
- **url** when a page is to be loaded (_jump_ and _open_ button types)
- **task** for a function call OR to name a response mode for a new context (_call_, _  add_, or _delete_ button types)

~~~srm
demo_mode
   procedure : App_Demo
   schema
      # An individual button
      button
         label : Individual Button
         type  : jump
         url   : www.cnn.com
      # A button group
      buttons
         button
            label : Task 1
            type  : call
            task  : task1_function
         button
            label : Task 2
            type  : call
            task  : task2_function
~~~


## Button Types

Buttons can be added to tables or to forms and dialogs.

### Table-view Related Buttons

While the __r__ and __u__ parts of CRUD are handled in table views by clicking on
a table line, adding and deleting require another trigger which is handled by framework
buttons.

The unique characteristic of a CRUD operation is that the underlying table should
show the change when the operation is successful.  For this reason, the use of the
following _add_ and _delete_ buttons is restricted to table-view dialogs.

#### Button Type _add_

Presents a dialog for adding a record to a table.

~~~
button
   label : Add Record
   type  : add
   task  : mysrm.srm?add_record
~~~

#### Button Type _delete_

Like the _add_ button, the _delete_ button is closely tied to a table view, though
in this case the button is included in an edit dialog generated from the table view.

This is a special button type that can be set up to ask a confirming question before
executing the delete.  Note how the _confirm_ instruction provides a confirmation
question.

Both the _confirm_ and _task_ instructions benefit from
[Context References](ContextReferences.md).  The confirmation question should include
some context information to help the user make a good deccision, and the task URL will
typically need at least a record number, if not also some additional corroborating data
to prevent accidental erasure.  The example below includes context references in the
_confirm_ and _task_ instructions.

~~~
button
   label   : Delete Record
   type    : delete
   confirm : Do you really want to delete {$fname} {$lname}?
   task    : mysrm.srm?delete_record&person_id={$id}&lname={$lname}
~~~

### General Purpose Buttons

These buttons can be added to either table views or forms and dialogs.  Where request
parameters are required, they must be provided using
[Context References](ContextReferences.md) in the URL.

#### Button Type _call_

This button type will call the function named in the _task_ instruction.  This generally
requires custom javascript included with a _script_ instruction.

~~~srm
button
   label : Do Strange Thing
   type  : call
   task  : my_do_strange_thing_function
~~~

#### Button Type _jump_

This will leave the current page and open the page referenced by the _url_
instruction.  The URL can be for another page on the same site but more typically
it means

~~~
button
   label  : Look at News
   type   : jump
   url    : www.cnn.com
~~~

#### Button Type _open_

The finaly built-in button type is the _open_ button.  It will cover the current
context with the response generated by calling the _url_ instruction of the button.

In the following example, I didn't use a context reference for the delete record,
but rather had the procedure get that data from session information.  That makes it
more clear that changing a password requires an valid, authenticated session.

~~~
button
   label   : Change Password
   type    : open
   url     : mysrm.srm?change_password
~~~   
     
 