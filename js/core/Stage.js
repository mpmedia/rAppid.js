define(["js/html/HtmlElement", "js/core/Bus", "js/core/WindowManager", "js/core/ExternalInterface"], function (HtmlElement, Bus, WindowManager, ExternalInterface) {
    return HtmlElement.inherit("js.core.Stage", {
        $containerOrder: {
            'windows' : 0,
            'popups': 1,
            'tooltips' : 2
        },

        defaults: {
            tagName: "div",
            'class': 'stage'
        },

        ctor: function(requireJsContext, applicationContext, document, window){

            this.$requirejsContext = requireJsContext;
            this.$applicationContext = applicationContext;
            this.$applicationFactory = null;
            this.$document = document;
            this.$window = window;
            this.$bus = new Bus();
            this.$externalInterface = new ExternalInterface(this);

            this.$containers = {};
            this.$elements = {};

            this.callBase(null, false, this, null, this);

            this._annotateDevice();
        },

        _annotateDevice: function() {

            var classes = ["stage"];

            if (this.runsInBrowser()) {
                var window = this.$window;

                classes.push("browser");
                classes.push("ontouchend" in window ? "touch" : "no-touch");

                var mobile = (/(iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm)/i.test(window.navigator.userAgent));
                if (mobile) {
                    classes.push('mobile');
                    classes.push(mobile[1]);
                } else {
                    classes.push('desktop');
                }

            } else {
                classes.push("node");
            }

            this.set('class', classes.join(" "));
        },

        createChildren: function() {

            this.$windowManager = this.createComponent(WindowManager);
            return [this.$windowManager];

        },

        render: function(target){
            var dom = this.callBase(null);

            if (this.$externalInterface) {
                this.$externalInterface._stageRendered(dom);
            }

            if (target) {
                target.appendChild(dom);
                this.$bus.trigger('Stage.Rendered', target);

                this.trigger('add:dom', target);
            }
            return dom;
        },
        createWindow: function(elementId){
            return this.createHtmlElement(elementId,"windows");
        },
        createTooltip: function(tooltipId){
            return this.createHtmlElement(tooltipId, "tooltips");
        },
        createHtmlElement: function(elementId, containerId){
            var container = this.$containers[containerId];
            if(!container){
                // TODO: remove this shit
                container = this.createContainer({'class' : containerId + "-container"});
                this.$containers[containerId] = container;
                this.addChild(container);
                if(this.$containerOrder[containerId]){
                    container.setChildIndex(this.$containerOrder[containerId]);
                }
            }

            var element = this.$elements[containerId + "_" + elementId];
            if(!element){
                element = this.createContainer({});
                container.addChild(element);
            }

            return element.$el;
        },
        createContainer: function(attributes){
            attributes = attributes || {};
            return this.$stage.$applicationContext.createInstance(HtmlElement, [attributes, null, this.$stage, this, this]);
        }

    });
});