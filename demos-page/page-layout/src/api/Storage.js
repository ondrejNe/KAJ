/**
 * Class representing a storage mechanism for a specific object type with localStorage.
 * Extends the EventTarget class to enable event-driven interactions.
 */
export class Storage extends EventTarget {

    /**
     * Creates an instance of Storage.
     * @param {Function} objectClass - The class type of the object to be stored.
     * @param {string} localStorageKey - The key to use for localStorage.
     */
    constructor(objectClass, localStorageKey) {
        super(); // Call the parent class's constructor
        this.localStorageKey = localStorageKey; // Store the localStorage key
        this.objectClassType = objectClass; // Store the class type for validation

        // Load existing data from localStorage
        this._readStorage();

        // Event listener to handle changes to localStorage from other windows/tabs
        window.addEventListener(
            "storage",
            () => {
                this._readStorage(); // Reload rules from localStorage
                this._saveStorage(); // Save the current state (triggers 'save' event)
            },
            false
        );
    }

    /**
     * Private method to read data from localStorage.
     * If data exists, it converts the JSON string back to an object of the specified class type.
     * If no data exists, it sets the objectClass to null.
     * @private
     */
    _readStorage() {
        const data = JSON.parse(window.localStorage.getItem(this.localStorageKey) || 'null');
        if (data) {
            this.objectClass = this.objectClassType.fromObject(data);
        } else {
            this.objectClass = null;
        }
    }

    /**
     * Private method to save the current object to localStorage and dispatch a 'save' event.
     * If the objectClass is null, it removes the item from localStorage.
     * @private
     */
    _saveStorage() {
        if (this.objectClass) {
            window.localStorage.setItem(this.localStorageKey, JSON.stringify(this.objectClass));
        } else {
            window.localStorage.removeItem(this.localStorageKey);
        }
        this.dispatchEvent(new CustomEvent("save"));
    }

    /**
     * Reads and returns the current object from storage.
     * @returns {Object|null} The stored object or null if no object is stored.
     */
    read() {
        return this.objectClass;
    }

    /**
     * Saves an object to storage after validating its type.
     * @param {Object} object - The object to be stored.
     * @throws {TypeError} Throws an error if the object is not an instance of the specified class type.
     */
    save(object) {
        if (!(object instanceof this.objectClassType)) {
            throw new TypeError(`Expected instance of ${this.objectClassType.name}`);
        }
        this.objectClass = object;
        this._saveStorage();
    }

    /**
     * Clears the stored object from storage and sets the storage to null.
     */
    clear() {
        this.objectClass = null;
        this._saveStorage();
    }
}
