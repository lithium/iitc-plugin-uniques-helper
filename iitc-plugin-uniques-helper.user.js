// ==UserScript==
// @id             iitc-plugin-uniques-helper@nobody889
// @name           IITC plugin: Uniques Helper - Import/Export via json
// @category       Misc
// @version        0.5.0
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @description    [iitc-2017-01-08-021732] import/export uniques 
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if (typeof window.plugin !== 'function') window.plugin = function() {};
// PLUGIN START ////////////////////////////////////////////////////////


class UniquesHelperPlugin {
	constructor() {

	    var a = $('<a tabindex="0">Uniques</a>').click(this.showDialog.bind(this));
	    $('#toolbox').append(a);
	}

	importUniques(uniques) {

		console.log("UNIQUES", uniques)
		window.plugin.uniques.uniques = uniques 
		window.plugin.uniques.sync();
		window.runHooks('pluginUniquesRefreshAll');
	}

    showDialog() {
    	if (this.dialog) {
    		return;
    	}

    	this.element = $('<div></div>')

    	var textarea = $('<textarea></textarea>')
    	textarea.css({width: "370px", height: "200px"})
    	textarea.focus(() => {
    		textarea.select();
    	})
    	textarea.val(JSON.stringify(window.plugin.uniques.uniques))
    	this.element.append(textarea)


    	var importButton = $('<button>Import</button>')
    	importButton.click(() => {
    		var uniques = undefined
    		try {
	    		uniques = JSON.parse(textarea.val())
    		} catch (e) {
    			alert("invalid json")
    		}

	    	if (uniques !== undefined && confirm("This will irreversibly reset your local uniques data. Are you sure?")) {
	    		this.importUniques(uniques)
	    	}
    	})
    	this.element.append(importButton)

	    this.dialog = dialog({
	      title: "Import/Export Uniques",
	      html: this.element,
	      height: 'auto',
	      width: '400px',
	      closeCallback: () => this.closeDialog()
	    }).dialog('option', 'buttons', {
	      'OK': function() { $(this).dialog('close') },
	    });
    }

    closeDialog() {
    	this.dialog = undefined;
    }
}

UniquesHelperPlugin.boot = function() {
  window.plugin.uniquesHelper = new UniquesHelperPlugin()
}

var setup = UniquesHelperPlugin.boot;
// PLUGIN END //////////////////////////////////////////////////////////

setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);

// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end


// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
