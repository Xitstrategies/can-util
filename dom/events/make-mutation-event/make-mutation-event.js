'use strict';

// This sets up an inserted event to work through mutation observers if
// mutation observers are present.  If they aren't you have to use
// the mutate methods.
var events = require("../events");
var domData = require("../../data/data");
var getMutationObserver = require("can-globals/mutation-observer/mutation-observer");
var domDispatch = require("../../dispatch/dispatch");
var mutationDocument = require("../../mutation-observer/document/document");
var getDocument = require('can-globals/document/document');
var CIDMap = require("../../../js/cid-map/cid-map");
var string = require("../../../js/string/string");

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
					handler: function(mutatedNode){
						// keeps track of elements that have already been checked
						// so we don't double check (a parent and then a child added to the parent)
						if(specialEventData.nodeIdsRespondingToInsert.has(mutatedNode)) {
							domDispatch.call(mutatedNode, specialEventName, [], false);
							specialEventData.nodeIdsRespondingToInsert.delete(mutatedNode);
						}
					},
					nodeIdsRespondingToInsert: new CIDMap()
				};
				mutationDocument["on" + string.capitalize(mutationNodesProperty)](specialEventData.handler);
				domData.set.call(documentElement, specialEventName+"Data", specialEventData);
			}

			if(this.nodeType !== 11) {
				// count the number of handlers for this event
				var count = specialEventData.nodeIdsRespondingToInsert.get(this) || 0;
				specialEventData.nodeIdsRespondingToInsert.set(this, count + 1);
			}
		}
		return originalAdd.apply(this, arguments);

	};

	events.removeEventListener = function(eventName){
		if(eventName === specialEventName && getMutationObserver() ) {
			var documentElement = getDocument().documentElement;
			var specialEventData = domData.get.call(documentElement, specialEventName+"Data");
			if(specialEventData) {
				var newCount = specialEventData.nodeIdsRespondingToInsert.get(this) - 1;

				// if there is still at least one handler for this event, update the count
				// otherwise remove this element from the CIDMap
				if (newCount) {
					specialEventData.nodeIdsRespondingToInsert.set(this, newCount);
				} else {
					specialEventData.nodeIdsRespondingToInsert.delete(this);
				}

				if(!specialEventData.nodeIdsRespondingToInsert.size) {
					mutationDocument["off" + string.capitalize(mutationNodesProperty)](specialEventData.handler);
					domData.clean.call(documentElement, specialEventName+"Data");
				}
			}
		}
		return originalRemove.apply(this, arguments);
	};
};
