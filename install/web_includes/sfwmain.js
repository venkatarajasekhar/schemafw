window.onload = function()
{
   var xmlDoc=null, xslObj=null;
   var sfwmeta = null;

   var meta_jump = null;
   var meta_modeType = null;
   var meta_post = false;

   var meta_message = null;

   function start_app()
   {
      prepare_event_handling();
      resize_table_headers();
   }

   function parse_meta_data()
   {
      var tattr;
      if ((sfwmeta=document.getElementById("schemafw-meta")))
      {
         meta_jump = sfwmeta.getAttribute("data-jump");
         meta_modeType = sfwmeta.getAttribute("data-modeType");
         meta_post = (tattr=sfwmeta.getAttribute("data-post")) && tattr=="true";
                      
         var nl = sfwmeta.getElementsByTagName("span");
         for (var i=0, stop=nl.length; i<stop; ++i)
         {
            var el = nl[i];
            switch(el.className)
            {
            case "message":
               meta_message = { text : el.firstChild.data };
               if ((tattr=el.getAttribute("data-detail")))
                  meta_message.detail = String(tattr);
               if ((tattr=el.getAttribute("data-type")))
                  meta_message.type = String(tattr);
               break;
            }
         }
      }
   }
   
   function show_message(msgobj)
   {
      var text = msgobj.text;
      if ("type" in msgobj)
         text = "(" + msgobj.type + ") " + text;
      
      if ("detail" in msgobj)
         text += "\n   " + msgobj + msgobj.detail;

      alert(text);
   }

   function seek_embedded_form()
   {
      var host, forms, form;
      if ((host=document.getElementById("SFW_Content")))
         if ((forms=host.getElementsByTagName("form")))
            if (forms.length && (form=forms[0]))
               if (class_includes(form, "Embedded"))
                  return form;
      
      return null;
   }
   
   function prepare_embedded_form(form)
   {
      center_form(form, true);
      form.style.visibility = "visible";
      SchemaFW.focus_on_first_field(form);
      if (xmlDoc)
         form.xmldoc = xmlDoc;
   }

   function docs_available()
   {
      if ((xmlDoc = getXMLDocument()))
      {
         var docel = xmlDoc.documentElement;
         if (!docel)
            alert("Missing document element.");

         var form;
         if ((form=seek_embedded_form()))
             form.xmldoc = xmlDoc;
         
         if ((xslObj = new XSL(getXSLDocument())))
         {
            SchemaFW.set_xmldoc(xmlDoc);
            SchemaFW.set_xslobj(xslObj);
         }
      }
   }

   // Page processing starts here:

   if (!"body" in document)
      document.body = document.getElementsByTagName("body")[0];

   parse_meta_data();

   InitializeSchemaFW();
   
   var form = seek_embedded_form();
   if (form)
      prepare_embedded_form(form);

   if ("sfwvars" in window)
      process_sfwvars(sfwvars);
   else if (!meta_post)
      getXMLDocs(docs_available);

   if (meta_message)
      show_message(meta_message);

   xhr_default_req_header("SFW-XHRequest","true");

   start_app();
};

function process_sfwvars(obj)
{
   if ("error" in obj && obj.error==0)
   {
      if ("jump_no_error" in obj)
         window.location = obj.jump_no_error;
   }
}

function prepare_event_handling()
{
   function addEvent(name,f,el)
   {
      var target = el || document.body;
      if (target.addEventListener)
         target.addEventListener(name,f,true);
      else if ((target=el||document) && target.attachEvent)
         target.attachEvent("on"+name,f);
   }

   function f(ev)
   {
      var e=ev||window.event;
      var t=e.target||e.srcElement;

      if (e.type=="resize")
         resize_table_headers();

      if (!process_dpicker(e,t))
         return false;
      if (!Moveable.process_event(e,t))
         return false;
      if (!SchemaFW.process_event(e,t))
         return false;
      if (!SchemaFW.process_button(e,t))
         return false;

      // I don't like this solution (simply moving to the end),
      // especially since the only thing custom_handler is doing
      // is handling the ESC key.  It should have a better name,
      // and there should be a preempt custom handler as well as
      // a handler for after SchemaFW.process_event().
      //
      // The problem is that this is a bigger design decision:
      // should _new_context() be changed into an object?  How does
      // the context object integrate with the rest of event handling?
      // How do contexts stack?  Too many questions need answers for
      // me to spend the time now when moving this code fixes the
      // problem of closing the context when the situation only calls
      // for closing a dialog.
      if ("custom_handler" in window && window.custom_handler)
      {
         if (!window.custom_handler(e,t))
            return false;
      }
      
      return event_handler(e,t);
   }

   // ADD EVENTS HERE:
   Events.add_event("click",f);
   Events.add_event("mousedown",f);  // mousedown and mouseup for dragging dialog
   Events.add_event("mouseup",f);
   Events.add_event("keydown",f);
   Events.add_event("keyup",f);
   Events.add_event("keypress",f);
   Events.add_event("focus",f);

   window.onresize = f;
}

function event_handler(e,t)
{
   return true;
}

var center_form = function(form, horizontal_only)
{
   var html = document.documentElement;
   
   var h_form = form.offsetHeight;
   var w_form = form.offsetWidth;
   var h_window = html.clientHeight;
   var w_window = html.clientWidth;

   var left = w_window/2 - w_form/2;
   form.style.left = SchemaFW.px(left);
   
   if (!horizontal_only)
   {
      var top = h_window/2 - h_form/2;
      form.style.top = SchemaFW.px(top);
   }

};

function resize_table_headers()
{
   var nlTables = document.getElementsByTagName("table");
   var stop = nlTables.length;
   if (stop)
   {
      for (var i=0; i<stop; ++i)
         if (class_includes(nlTables[i], "Schema"))
         {
            SchemaFW.fix_table_heads(nlTables[i]);
         }
   }
}

