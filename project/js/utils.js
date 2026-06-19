/*
    FILE: utils.js
    PURPOSE: Utility functions used across Nexura frontend scripts
*/

function qs(selector, scope = document) {
    return scope.querySelector(selector);
}

function qsa(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
}

function safeParseJson(value, fallback = {}) {
    try {
        return JSON.parse(value) || fallback;
    } catch (error) {
        return fallback;
    }
}

function setStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getStorage(key, fallback = null) {
    const value = localStorage.getItem(key);
    return value ? safeParseJson(value, fallback) : fallback;
}

function removeStorage(key) {
    localStorage.removeItem(key);
}

function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function toggleClass(element, className) {
    if (element) element.classList.toggle(className);
}

function addClass(element, className) {
    if (element) element.classList.add(className);
}

function removeClass(element, className) {
    if (element) element.classList.remove(className);
}

function formatDate(timestamp = Date.now()) {
    return new Date(timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}
