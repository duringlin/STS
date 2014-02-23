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

/**判断涨跌 0 无变化 1 涨 -1 跌**/
function judgeChange(mValue){
	if(parseFloat(mValue)>0){
		return 1;
	}
	else if(parseFloat(mValue)<0){
		return -1;
	}
	else{
	return 0;
	}
}

/**根据涨跌改变颜色**/
function changeColor(mValue,mElement){
	if(judgeChange(mValue)==1){
		mElement.style.color="#eb6877";
	}
	else if(judgeChange(mValue)==-1){
		mElement.style.color="#80c269";
	}
	else{
		mElement.style.color="#535353";
	}
}

/**根据涨跌改变内容**/
function changeValue(mValue,mElement,mChangeValues){
    if(mChangeValues.length!=3)
    return;
	if(judgeChange(mValue)==1){
		mElement.innerHTML=mChangeValues[2];
	}
	else if(judgeChange(mValue)==-1){
		mElement.innerHTML=mChangeValues[0];
	}
	else{
		mElement.innerHTML=mChangeValues[1];
	}
}