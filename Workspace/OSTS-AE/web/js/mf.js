/**清空表单**/
function clearForm(form)
{
    var formObj = form[0];
    if(formObj == undefined)
    {
        return;
    }
    
    for(var i=0; i<formObj.elements.length; i++)
    {
        if(formObj.elements[i].type == "text")
        {
            formObj.elements[i].value = "";
        }
        else if(formObj.elements[i].type == "password")
        {
            formObj.elements[i].value = "";
        }
        else if(formObj.elements[i].type == "radio")
        {
            formObj.elements[i].checked = false;
        }
        else if(formObj.elements[i].type == "checkbox")
        {
            formObj.elements[i].checked = false;
        }
        else if(formObj.elements[i].type == "select-one")
        {
            formObj.elements[i].options[0].selected = true;
        }
        else if(formObj.elements[i].type == "select-multiple")
        {    
            for(var j = 0; j < formObj.elements[i].options.length; j++)
            {
                formObj.elements[i].options[j].selected = false;
            }
        }
        else if(formObj.elements[i].type == "file")
        {
            //formObj.elements[i].select();
            //document.selection.clear();             
            // for IE, Opera, Safari, Chrome
            var file = formObj.elements[i];
             if (file.outerHTML) {
                 file.outerHTML = file.outerHTML;
             } else {
                 file.value = "";  // FF(包括3.5)
            }
        }
        else if(formObj.elements[i].type == "textarea")
        {
            formObj.elements[i].value = "";
        }
    }
    
}