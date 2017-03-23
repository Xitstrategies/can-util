// This sets up an inserted event to work through mutation observers if
// mutation observers are present.  If they aren't you have to use
// the mutate methods.

var each = require("../../../js/each/each");
var makeArray = require("../../../js/make-array/make-array");

var events = require("../events");
var domData = require("../../data/data");
var getMutationObserver = require("../../mutation-observer/mutation-observer");
var domDispatch = require("../../dispatch/dispatch");
var mutationDocument = require("../../mutation-observer/document/document");
var getDocument = require("../../document/document");
var CIDStore = require("../../../js/cid-set/cid-set");

require("../../is-of-global-document/is-of-global-document");

/**
 * @module {Function} can-util/dom/events/make-mutation-event/make-mutation-event makeMutationEvent
 * @parent can-util/dom/events/events
 *
 * @signature `makeMutationEvent(specialEventName, mutationNodesProperty)`
 *
 * @param {String} specialEventName the event to handle as a mutation observer-based event
 * @param {String} mutationNodesProperty the property of interest in a DOM mutation
 *
 * This function provides a simple interface to bind the DOM events interface to the mutation
 * observer interface, by firing an event when a matching mutation is generated by the client
 */
module.exports = function(specialEventName, mutationNodesProperty){
	var originalAdd = events.addEventListener,
		originalRemove = events.removeEventListener;
	var dispatchIfListening = function(mutatedNode, specialEventData, dispatched){
		var doDispatch = true;
		if(dispatched.has(mutatedNode)) {
			return true;
		}
		dispatched.add(mutatedNode);
		if(specialEventName === "removed") {
			var documentElement = getDocument().documentElement;
			if(documentElement.contains(mutatedNode)) {
				doDispatch = false;
			}
		} 

		if(doDispatch && specialEventData.nodeIdsRespondingToInsert.has(mutatedNode)) {
			domDispatch.call(mutatedNode, specialEventName, [], false);
		}
	};

	events.addEventListener = function(eventName){
		// on an inserted event
		// if it's the first inserted event, we'll register a handler to the
		// mutationDocument singleton.  This will take nodes that are added
		// and fire add / remove events.
		if(eventName === specialEventName && getMutationObserver()) {
			var documentElement = getDocument().documentElement;
			var specialEventData = domData.get.call(documentElement,specialEventName+"Data");
			if(!specialEventData) {
				specialEventData = {
					handler: function(mutations){
						// keeps track of elements that have already been checked
						// so we don't double check (a parent and then a child added to the parent)
						var dispatched = new CIDStore();
						mutations.forEach(function(mutation){
							each(mutation[mutationNodesProperty],function(mutatedNode){
								var children = mutatedNode.getElementsByTagName && makeArray( mutatedNode.getElementsByTagName("*") );
								var alreadyChecked = dispatchIfListening(mutatedNode, specialEventData, dispatched);
								if(children && !alreadyChecked) {
									for (var j = 0, child;
										(child = children[j]) !== undefined; j++) {
										dispatchIfListening(child, specialEventData, dispatched);
									}
								}
							});
						});
					},
					nodeIdsRespondingToInsert: new CIDStore()
				};
				mutationDocument.add(specialEventData.handler);
				domData.set.call(documentElement,specialEventName+"Data", specialEventData);
			}
			specialEventData.nodeIdsRespondingToInsert.add(this);
		}
		return originalAdd.apply(this, arguments);

	};

	events.removeEventListener = function(eventName){
		if(eventName === specialEventName && getMutationObserver() ) {
			var documentElement = getDocument().documentElement;
			var specialEventData = domData.get.call(documentElement,specialEventName+"Data");
			if(specialEventData) {
				specialEventData.nodeIdsRespondingToInsert["delete"](this);

				if(!specialEventData.nodeIdsRespondingToInsert.size) {
					mutationDocument.remove(specialEventData.handler);
					domData.clean.call(documentElement,specialEventName+"Data");
				}
			}
		}
		return originalRemove.apply(this, arguments);
	};
};
