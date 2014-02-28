/**input的下拉框**/
function dropList(obj){
        var subjects = ['600148 长春一东(CCYD)', '601398 工商银行(GSYH)', '002142 宁波银行(NBYH)', '601939 建设银行(JSYH)', '601009 南京银行(NJYH)'];
        
        $(obj).typeahead({source: subjects});
       }
       
       /**获取股票列表**/
       function getStockList(){
	       /**通过ajax实现**/
       }

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

/**根据某个值改变颜色**/
function changeColorWithBase(mValue1,mValue2){
	if(mValue1<mValue2){
		mValue2.style.color="#eb6877";
	}
	else if(mValue1>mValue2){
		mValue2.style.color="#80c269";
	}
	else{
		mValue2.style.color="#535353";
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


/**根据某个值改变颜色**/
function changeColorInEntrust(mElement){
	if(mElement.innerText=="委托取消"){
		mElement.style.color="#89c997";
	}
	else if(mElement.innerText=="部分成交"){
		mElement.style.color="#8c97cb";
	}
	else if(mElement.innerText=="尚未成交"){
		mElement.style.color="#f29a76";
	}
	else if(mElement.innerText=="成交失败"){
		mElement.style.color="#ec6941";
	}
	else{
		mElement.style.color="#535353";
	}
}

/**bootstrap-typeahead**/
!
function(a) {
    var b = function(b, c) {
        this.$element = a(b),
        this.options = a.extend({},
        a.fn.typeahead.defaults, c),
        this.matcher = this.options.matcher || this.matcher,
        this.sorter = this.options.sorter || this.sorter,
        this.highlighter = this.options.highlighter || this.highlighter,
        this.updater = this.options.updater || this.updater,
        this.source = this.options.source,
        this.$menu = a(this.options.menu),
        this.shown = !1,
        this.listen()
    };
    b.prototype = {
        constructor: b,
        select: function() {
            var a = this.$menu.find(".active").attr("data-value");
            return this.$element.val(this.updater(a)).change(),
            this.hide()
        },
        updater: function(a) {
            return a
        },
        show: function() {
            var b = a.extend({},
            this.$element.position(), {
                height: this.$element[0].offsetHeight
            });
            return this.$menu.insertAfter(this.$element).css({
                top: b.top + b.height,
                left: b.left
            }).show(),
            this.shown = !0,
            this
        },
        hide: function() {
            return this.$menu.hide(),
            this.shown = !1,
            this
        },
        lookup: function(b) {
            var c;
            return this.query = this.$element.val(),
            !this.query || this.query.length < this.options.minLength ? this.shown ? this.hide() : this: (c = a.isFunction(this.source) ? this.source(this.query, a.proxy(this.process, this)) : this.source, c ? this.process(c) : this)
        },
        process: function(b) {
            var c = this;
            return b = a.grep(b,
            function(a) {
                return c.matcher(a)
            }),
            b = this.sorter(b),
            b.length ? this.render(b.slice(0, this.options.items)).show() : this.shown ? this.hide() : this
        },
        matcher: function(a) {
            return~a.toLowerCase().indexOf(this.query.toLowerCase())
        },
        sorter: function(a) {
            var b = [],
            c = [],
            d = [],
            e;
            while (e = a.shift()) e.toLowerCase().indexOf(this.query.toLowerCase()) ? ~e.indexOf(this.query) ? c.push(e) : d.push(e) : b.push(e);
            return b.concat(c, d)
        },
        highlighter: function(a) {
            var b = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
            return a.replace(new RegExp("(" + b + ")", "ig"),
            function(a, b) {
                return "<strong>" + b + "</strong>"
            })
        },
        render: function(b) {
            var c = this;
            return b = a(b).map(function(b, d) {
                return b = a(c.options.item).attr("data-value", d),
                b.find("a").html(c.highlighter(d)),
                b[0]
            }),
            b.first().addClass("active"),
            this.$menu.html(b),
            this
        },
        next: function(b) {
            var c = this.$menu.find(".active").removeClass("active"),
            d = c.next();
            d.length || (d = a(this.$menu.find("li")[0])),
            d.addClass("active")
        },
        prev: function(a) {
            var b = this.$menu.find(".active").removeClass("active"),
            c = b.prev();
            c.length || (c = this.$menu.find("li").last()),
            c.addClass("active")
        },
        listen: function() {
            this.$element.on("focus", a.proxy(this.focus, this)).on("blur", a.proxy(this.blur, this)).on("keypress", a.proxy(this.keypress, this)).on("keyup", a.proxy(this.keyup, this)),
            this.eventSupported("keydown") && this.$element.on("keydown", a.proxy(this.keydown, this)),
            this.$menu.on("click", a.proxy(this.click, this)).on("mouseenter", "li", a.proxy(this.mouseenter, this)).on("mouseleave", "li", a.proxy(this.mouseleave, this))
        },
        eventSupported: function(a) {
            var b = a in this.$element;
            return b || (this.$element.setAttribute(a, "return;"), b = typeof this.$element[a] == "function"),
            b
        },
        move: function(a) {
            if (!this.shown) return;
            switch (a.keyCode) {
            case 9:
            case 13:
            case 27:
                a.preventDefault();
                break;
            case 38:
                a.preventDefault(),
                this.prev();
                break;
            case 40:
                a.preventDefault(),
                this.next()
            }
            a.stopPropagation()
        },
        keydown: function(b) {
            this.suppressKeyPressRepeat = ~a.inArray(b.keyCode, [40, 38, 9, 13, 27]),
            this.move(b)
        },
        keypress: function(a) {
            if (this.suppressKeyPressRepeat) return;
            this.move(a)
        },
        keyup: function(a) {
            switch (a.keyCode) {
            case 40:
            case 38:
            case 16:
            case 17:
            case 18:
                break;
            case 9:
            case 13:
                if (!this.shown) return;
                this.select();
                break;
            case 27:
                if (!this.shown) return;
                this.hide();
                break;
            default:
                this.lookup()
            }
            a.stopPropagation(),
            a.preventDefault()
        },
        focus: function(a) {
            this.focused = !0
        },
        blur: function(a) {
            this.focused = !1,
            !this.mousedover && this.shown && this.hide()
        },
        click: function(a) {
            a.stopPropagation(),
            a.preventDefault(),
            this.select(),
            this.$element.focus()
        },
        mouseenter: function(b) {
            this.mousedover = !0,
            this.$menu.find(".active").removeClass("active"),
            a(b.currentTarget).addClass("active")
        },
        mouseleave: function(a) {
            this.mousedover = !1,
            !this.focused && this.shown && this.hide()
        }
    };
    var c = a.fn.typeahead;
    a.fn.typeahead = function(c) {
        return this.each(function() {
            var d = a(this),
            e = d.data("typeahead"),
            f = typeof c == "object" && c;
            e || d.data("typeahead", e = new b(this, f)),
            typeof c == "string" && e[c]()
        })
    },
    a.fn.typeahead.defaults = {
        source: [],
        items: 8,
        menu: '<ul class="typeahead dropdown-menu"></ul>',
        item: '<li><a href="#"></a></li>',
        minLength: 1
    },
    a.fn.typeahead.Constructor = b,
    a.fn.typeahead.noConflict = function() {
        return a.fn.typeahead = c,
        this
    },
    a(document).on("focus.typeahead.data-api", '[data-provide="typeahead"]',
    function(b) {
        var c = a(this);
        if (c.data("typeahead")) return;
        c.typeahead(c.data())
    })
} (window.jQuery)