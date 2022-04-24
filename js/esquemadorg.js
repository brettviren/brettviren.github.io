//
// esquemadorg.js
//
// m3.2010 Daniel Clemente Laboreo. http://www.danielclemente.com/
//
// Initially based on org-info-jq from Sebastian Rose (2009): http://github.com/SebastianRose/org-info-js/blob/master/org-info-jq.js
// But it was fully rewritten and expanded.
// Extra changes:
// m5.2017, added experiments with different ways of hiding sections
// m5.2017, start with all sections visible, and allow to hide them when clicking. Added buttons to open all and close all
// 
// I'm still using it in m4.2020.
//
//
// Released under the GNU General Public License version 3
// see: http://www.gnu.org/licenses/
//

//
// What to put in your .org, in order to use this:
//
// #+HTML_HEAD_EXTRA: <script type="text/javascript" src="jquery-min.js"></script>
// #+HTML_HEAD_EXTRA: <script type="text/javascript" src="esquemadorg.js"></script>
// #+HTML_HEAD_EXTRA: <link rel="stylesheet" type="text/css" href="../pagina/esquemadorg.css"></link>
//
// You can find an example of real-world usage at:
// https://www.danielclemente.com/hacer/index.html
// https://www.danielclemente.com/hacer/index.org
// https://www.danielclemente.com/pagina/opc_org-info.org
// https://www.danielclemente.com/pagina/opc_publicar.org
// https://www.danielclemente.com/pagina/esquemadorg.js
// https://www.danielclemente.com/pagina/esquemadorg.css
//
// Please adapt it to your use case!
//


// How to hide non-active sections. You probably want just to *hide* them (i.e. see heading and no content). Other methods are experimental, with incomplete code.
var HOW_TO_HIDE = 'hide';
//var HOW_TO_HIDE = 'shrink'; // don't really hide, just make them very small. But large sections are still too large even when reduced
//var HOW_TO_HIDE = 'opacity'; // but large blocks don't really go away
//var HOW_TO_HIDE = 'scrollbar'; // could look nice, shows a dimmed preview and the scrollbar makes clear that there's more text inside. Needs better behaviour and code

function scrollSmoothlyToObj(obj,id) {
	// obj: $("#object")
	// id: "#object"

	// This line comes from:	*** Anchor Slider by Cedric Dugas	*** Http://www.position-absolute.com *** Thanks!
	$("html:not(:animated),body:not(:animated)").animate({ scrollTop: obj.offset().top}, 1100, function() {
		window.location.hash = id;
	});
}

function focusSection(id_anchor){
	// anchor: the id (text, without '#') of the h2/h3/h4/h5/h6/h7 which is to be made visible (together with its parents). The page will also scroll to focus that section

	var anchor1='#'+id_anchor;
	var anchor2='*[id=' + id_anchor + ']'; // this is equivalent to $("#id"), which strangely seems not to work
	var obj_anchor=$(anchor2);

	// Remove any other highlighted section which was the target of a previous link.
	// It does nothing if it's the first click
	$("div.orgjq-targeted").removeClass("orgjq-targeted");
	// Now highlight the target section and its parents. You may Use .css("background","orange") to test
	obj_anchor.parents("div.orgjq-contracted").addClass("orgjq-targeted");
	// Expand its parents so that the target section is connected to the root of the tree
	obj_anchor.parents("div.orgjq-contracted").each(
		function() {
			$(this).removeClass("orgjq-contracted").addClass("orgjq-expanded");
			$(this).children("div").show();
		}
	);
	// move the browser focus to that section
	scrollSmoothlyToObj(obj_anchor,anchor1);

}


function hideForOrg_whenclicked(div_obj) {
	div_obj.parent().removeClass("orgjq-expanded").addClass("orgjq-contracted");
	if(HOW_TO_HIDE=='hide'){
		div_obj.nextAll().hide("fast"); // "normal" es más lento
		div_obj.hide();
	} else if(HOW_TO_HIDE=='shrink'){
		//div_obj.css("zoom","0.25");
		// div_obj.nextAll().css("zoom","0.25");
		div_obj.css("font-size","50%");
		div_obj.nextAll().css("font-size","50%");
	} else if(HOW_TO_HIDE=='opacity'){
		div_obj.css("opacity","0.5");
		div_obj.nextAll().css("opacity","0.5");
	} else if(HOW_TO_HIDE=='scrollbar'){
		div_obj.parent().css({"height":"100px","overflow-y":"auto","opacity":"0.3"});
	} else {
		console.error("Not impl.");
	}
	
}
function showForOrg_whenclicked(div_obj) {
	div_obj.parent().removeClass("orgjq-contracted").addClass("orgjq-expanded");
	if(HOW_TO_HIDE=='hide'){
		div_obj.parents().show("normal");
		div_obj.nextAll().show("normal");div_obj.show();
	} else if(HOW_TO_HIDE=='shrink'){
		//div_obj.css("zoom","1");
		// div_obj.nextAll().css("zoom","1");
		div_obj.css("font-size","100%");
		div_obj.nextAll().css("font-size","100%");
	} else if(HOW_TO_HIDE=='opacity'){
		div_obj.css("opacity","1");
		div_obj.nextAll().css("opacity","1");
	} else if(HOW_TO_HIDE=='scrollbar'){
		div_obj.parents().css({"height":"auto","min-height":"100px","overflow-y":"inherit","opacity":"1"});
	} else {
		console.error("Not impl.");
	}
}
function toggleForOrg_whenclicked(div_obj) {
	if(div_obj.parent().hasClass("orgjq-expanded"))
		hideForOrg_whenclicked(div_obj);
	else
		showForOrg_whenclicked(div_obj);
}

// faster methods than calling the individual methods in a loop
function close_all_sections() {
	//$('.orgjq-expanded').removeClass("orgjq-expanded").addClass("orgjq-contracted");

	for(var i=2;i<=7;++i) {
		$(".outline-text-"+i).parent().removeClass("orgjs-expanded").addClass("orgjq-contracted");
		if(HOW_TO_HIDE=='hide'){
			/////		 $(".outline-text-"+i).hide();
			$(".outline-text-"+i).hide();
		} else if(HOW_TO_HIDE=='scrollbar'){
			//$(".outline-text-"+i).css({"height":"100px","overflow-y":"auto","opacity":"0.3"});
			// $(".outline-text-"+i).parent().css({"height":"100px","overflow-y":"auto","opacity":"0.3"});
			// console.error("nada");
		} else {
			console.error("Not impl.");
		}
	}

	// inside the h2 headers, all (now unseen) headers are also contracted
	for(var i=2;i<=7;++i) {
		$("h"+i).each(
			function(){
				$(this).parent().removeClass("orgjq-expanded").addClass("orgjq-contracted");
				if(HOW_TO_HIDE=='hide'){
					$(this).next("div").nextAll().hide();$(this).next("div").hide();
				} else if(HOW_TO_HIDE=='scrollbar'){
					// $(this).next("div").nextAll().css({"height":"100px","overflow-y":"auto","opacity":"0.3"});
					$(this).next("div").nextAll().css({"height":"100px","overflow-y":"auto","opacity":"0.3"});
					// console.error("nada2.");
				} else {
					console.error("Not impl.");
				}

			});
	}

}
function open_all_sections() {
	$('div#content .orgjq-contracted').not("#table-of-contents").removeClass("orgjq-contracted").addClass("orgjq-expanded");
	$('div#content').find(":hidden").not("#table-of-contents div").show();
}

function disable_global_outlining() {
	// not really used anymore

	// affect only the main (first level) sections
	var org= $("div#table-of-contents, div#content>div[id^='outline-container-']");
	//test: org.css({border: "2px solid red"});

	// show everything (all sections, …)
	org.find(":hidden").show();

	// remove classes and thus colors
	$(".orgjq-contracted").removeClass("orgjq-contracted");
	$(".orgjq-expanded").removeClass("orgjq-expanded");
	$(".orgjq-targeted").removeClass("orgjq-targeted");

	// headers are not clickable
	org.find("h1,h2,h3,h4,h5,h6,h7").css({cursor: "default"}).unbind("click");
	// links to sections no longer highlight the target
	$("a[href^='#']").unbind('click');
	// hide expand link
	$("div#outline-container-1 >h2 >a.expandAll").remove();


	// information
	alert("He cambiado al estilo tradicional: todo seguido. Si quieres volver a usar el esquemado con cabeceras clicables, recarga la página");
}

function enable_global_outlining() {
	// Called once e.g. the first time the page is loaded

	// handle the click event for each header
	for(var i=2;i<=7;++i) {
		$("h"+i).each(
			function(){
				$(this).css({cursor: "pointer"});
				$(this).bind('click', function(){ toggleForOrg_whenclicked( $(this).parent().children("div").eq(0) ); });
			});
	}

	/*
	// add link to deactive outlining. I wanted 2 links, „expand all“ and „contract all“, but the second one isn't of much use (and reloading the page does the same)
	// otros posibles nombres: "(expandir completamente)"
	var expAll_link = $( document.createElement('a') ).text("(ver todo seguido, sin esquemado)").addClass("expandAll").click(disable_global_outlining);
	$( $("div.outline-2")[0] ).find(">h2") .append(expAll_link);
	*/

	var par = $('<p />');
	par.append(document.createTextNode("Clica una sección para abrirla/cerrarla."));
	par.append(	$( document.createElement('a') ).text("Cerrar todas (ver esquema general).").addClass("globalexpandtool").click(close_all_sections));
	par.append(	$( document.createElement('a') ).text("Abrir todas (ver mucho texto).").addClass("globalexpandtool").click(open_all_sections));
	$("div#table-of-contents").after(par);


	/*
	// start with contracted TOC and headers   ← m5.2017: disabled because it has a huge penalty towards Google (hidden content won't be indexed)

	if(HOW_TO_HIDE=='hide'){
		$("#text-table-of-contents").hide();
	} else {
		console.error("Not impl.");
	}
	for(var i=2;i<=7;++i) {
		$(".outline-text-"+i).parent().addClass("orgjq-contracted");
		if(HOW_TO_HIDE=='hide'){
			/////		 $(".outline-text-"+i).hide();
			$(".outline-text-"+i).hide();
		} else if(HOW_TO_HIDE=='scrollbar'){
			//$(".outline-text-"+i).css({"height":"100px","overflow-y":"auto","opacity":"0.3"});
			// $(".outline-text-"+i).parent().css({"height":"100px","overflow-y":"auto","opacity":"0.3"});
			// console.error("nada");
		} else {
			console.error("Not impl.");
		}
	}

	// inside the h2 headers, all (now unseen) headers are also contracted
	for(var i=2;i<=7;++i) {
		$("h"+i).each(
			function(){
				$(this).parent().removeClass("orgjq-expanded").addClass("orgjq-contracted");
				if(HOW_TO_HIDE=='hide'){
					$(this).next("div").nextAll().hide();$(this).next("div").hide();
				} else if(HOW_TO_HIDE=='scrollbar'){
					// $(this).next("div").nextAll().css({"height":"100px","overflow-y":"auto","opacity":"0.3"});
					$(this).next("div").nextAll().css({"height":"100px","overflow-y":"auto","opacity":"0.3"});
					// console.error("nada2.");
				} else {
					console.error("Not impl.");
				}

			});
	}
	*/

	// alternatively: mark everything as open
	for(var i=2;i<=7;++i) {
		$("h"+i).each(
			function(){
				$(this).parent().removeClass("orgjq-contracted").addClass("orgjq-expanded");
			});
	}
	// except TOC
	$("div#table-of-contents").removeClass("orgjq-expanded").addClass("orgjq-contracted");
	$("#text-table-of-contents").hide('slow'); // user should see how it contracts to see how the outliner works
	$("div#table-of-contents").attr("title","Clica las cabeceras borrosas para ver o esconder el contenido");


	// If provided #fragment in URL, we must locate and open the corresponding header and its parents
	var url = document.location.toString();
	if (url.match('#')) { // the URL contains an anchor
		var id_anchor = url.split('#')[1];
		focusSection(id_anchor);
	}


	// internal links to anchors, e.g. <a href="#sec2">, should also expand the destination section before scrolling there
	//Test:	  $("a[href^='#']").css("border","2px dotted red");
	$("a[href^='#']").each(function(){
		var caller=this;
		$(caller).click(function (event) {
			var href=$(caller).attr("href");
			var id_href=href.substr(1);
			focusSection(id_href);
			return false;
		});

	});

	// the page is now ready to be used

}

// Code starts here

$(document).ready(enable_global_outlining);


