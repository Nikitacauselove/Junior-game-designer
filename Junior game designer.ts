/*              Получение случайного целого числа в заданном интервале, включительно              */

function getRandom(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/*              Кортеж редкостей              */

enum Rareness {COMMON, UNCOMMON, RARE, LEGENDARY};


/*              Задание 1              */

class Item {
    _name: string;
    _rare: string;
    _type: string;

    constructor (name: string, rare: string, type: string) {
        this._name = name;
        this._rare = rare;
        this._type = type;
    }

    get name () {
        return this._name;
    }
    get rare () {
        return this._rare;
    }
    get type () {
        return this._type
    }

    set name (name: string) {
        this._name = name;
    }
    set rare (rare: string) {
        this._rare = rare;
    }
    set type (type: string) {
        this._type = type;
    }
}


/*              Задание 1              */

class Pack {
    protected static _items: Map<string, Item[]> = Pack.fillItemsMap(require('./itemsBase.json'));
    protected static rareUp (rare: string): string {    /*    Вычислительная сложность O(1)    */
        let event: number = getRandom(1, 1000);
        if (event <= 100) {return Rareness[Math.min(Rareness[rare] + 1, Rareness["LEGENDARY"])]}                    /*    p = 0.1    */
        if (101 <= event && event <= 110) {return Rareness[Math.min(Rareness[rare] + 2, Rareness["LEGENDARY"])]}    /*    p = 0.01    */
        if (event === 111) {return Rareness[Math.min(Rareness[rare] + 3, Rareness["LEGENDARY"])]}                   /*    p = 0.001    */
        return rare;
    }

    private static fillItemsMap (jsonItemsBase: Item[]): Map<string, Item[]> {    /*    Вычислительная сложность O(n * log(n)), где n - число предметов в jsonItemsBase    */
        function sortByType (itemsBase: Map<string, Item[]>): Map<string, Item[]> {    /*    Вычислительная сложность O(n * log(n)), где n - число предметов в jsonItemsBase    */
            for (let key of Array.from(itemsBase.keys()))
                itemsBase.get(key).sort((a, b) => a.type > b.type ? 1 : -1);
            return itemsBase;
        }
        let itemsBase: Map<string, Item[]> = new Map<string, Item[]>();
        for (let item of jsonItemsBase)
            itemsBase.has(item.rare) ?
                itemsBase.get(item.rare).push(item) : itemsBase.set(item.rare, [item]);
        return sortByType(itemsBase);
    }

    static get items () {
        return Pack._items;
    }
}

class Booster_pack extends Pack {
    static open (rare: string): Item[] {    /*    Вычислительная сложность O(1)    */
        let result: Item[] = [];
        for (let i = 0; i < 2; i++) {
            let finalRare: string = (rare === "LEGENDARY" ? rare : this.rareUp(rare));
            result.push(this.pickItem(finalRare));
        }
        rare = Rareness[Rareness[rare] - 1];
        for (let i = 0; i < 3; i++) {
            let finalRare: string = this.rareUp(rare);
            result.push(this.pickItem(finalRare));
        }
        return result;
    }

    private static pickItem (rare: string): Item {    /*    Вычислительная сложность O(1)    */
        let index: number = Math.floor(Math.random() * this.items.get(rare).length)
        return this.items.get(rare)[index];
    }
}


/*              Задание 2              */

class Consistent_pack extends Pack {
    static open (rare: string): Item[] {    /*    Вычислительная сложность О(1)    */
        function fillBannedTypes (type: string, bannedTypes: string[], countByType: Map<string, number>): string[] {     /*    Вычислительная сложность O(1)    */
            countByType.has(type) ? countByType.set(type, countByType.get(type) + 1) : countByType.set(type, 1);
            if (countByType.get(type) === 2)
                bannedTypes.push(type);
            return bannedTypes;
        }

        let result: Item[] = [];
        let bannedTypes: string[] = [];
        let countByType: Map<string, number> = new Map<string, number>();

        for (let i = 0; i < 2; i++) {
            let finalRare: string = (rare === "LEGENDARY" ? rare : this.rareUp(rare));
            let itemToPush: Item = this.pickItem(finalRare, bannedTypes);
            fillBannedTypes(itemToPush.type, bannedTypes, countByType);
            result.push(itemToPush);
        }
        rare = Rareness[Rareness[rare] - 1];
        for (let i = 0; i < 3; i++) {
            let finalRare: string = this.rareUp(rare);
            let itemToPush: Item = this.pickItem(finalRare, bannedTypes);
            fillBannedTypes(itemToPush.type, bannedTypes, countByType);
            result.push(itemToPush);
        }
        return result;
    }

    private static _numberOfItems: Map<string, Map<string, number>> = Consistent_pack.fillNumberOfItemsMap(Pack.items);    /*    В Map для каждой редкости (rarity) содержится количетсво предметов каждого типа (type)    */
    private static fillNumberOfItemsMap (itemsBase: Map<string, Item[]>): Map<string, Map<string, number>> {    /*  Вычислительная сложность O(n), где n - число предметов в jsonItemsBase    */
        let indexMap = new Map<string, Map<string, number>>();
        for (let key of Array.from(itemsBase.keys()))
            for (let item of itemsBase.get(key))
                if (indexMap.has(item.rare))
                    indexMap.get(item.rare).has(item.type) ?
                        indexMap.get(item.rare).set(item.type, indexMap.get(item.rare).get(item.type) + 1) : indexMap.get(item.rare).set(item.type, 1);
                else {
                    indexMap.set(item.rare, new Map<string, number>());
                    indexMap.get(item.rare).set(item.type, 1);
                }
        return indexMap;
    }
    private static pickItem (rare: string, bannedTypes: string[]): Item {    /*  Вычислительная сложность O(1)    */
        let numberOfBannedItems: number = bannedTypes.reduce(
            (accumulator, currentValue) => this.numberOfItems.get(rare).get(currentValue),
            0
        );
        let index: number = Math.floor(Math.random() * (this.items.get(rare).length - numberOfBannedItems));

        while (bannedTypes.includes(this.items.get(rare)[index].type)) {
            let type: string = this.items.get(rare)[index].type;
            index += this.numberOfItems.get(rare).get(type);    /*    Пропуск предметов, имеющих недопустимый тип (type)    */
        }
        return this.items.get(rare)[index];
    }

    private static get numberOfItems () {
        return Consistent_pack._numberOfItems;
    }
}


/*              Задание 3              */

class Fair_pack extends Pack {
    static open (rare: string, inventory: Inventory): Item[] {    /*    Вычислительная сложность O(1). Вычислительная сложность O(n), где n - число предметов в jsonItemsBase, если требуется корректировка    */
        function resultMapToArray (result: Map<string, Item[]>): Item[] {
            let resultArray: Item[] = [];
            for (let key of Array.from(result.keys()))
                resultArray = resultArray.concat(result.get(key));
            return resultArray;
        }
        let fairRare: string = rare;
        if (this.needToCorrect(fairRare, inventory)) {
            let result: Map<string, Item[]> = new Map<string, Item[]>();
            for (let i = 0; i < 2; i++) {
                let finalRare: string = (rare === "LEGENDARY" ? rare : this.rareUp(rare));
                this.resultMapUpdate(result, fairRare, finalRare, inventory);
            }
            rare = Rareness[Rareness[rare] - 1];
            for (let i = 0; i < 3; i++) {
                let finalRare: string = this.rareUp(rare);
                this.resultMapUpdate(result, fairRare, finalRare, inventory);
            }
            if (this.needToCorrect(fairRare, inventory)) {
                let numberOfNewFairItems = result.has("New fair items") ? result.get("New fair items").length : 0;
                for (let j = 0; j < 2 - numberOfNewFairItems; j++)
                    this.resultMapCorrect(result, fairRare, inventory);
            }
            inventory.fairDataUpdate(fairRare);
            return resultMapToArray(result);
        } else {
            let result: Item[] = [];
            for (let i = 0; i < 2; i++) {
                let finalRare: string = (rare === "LEGENDARY" ? rare : this.rareUp(rare));
                result.push(this.pickItem(finalRare, fairRare, inventory));
            }
            rare = Rareness[Rareness[rare] - 1];
            for (let i = 0; i < 3; i++) {
                let finalRare: string = this.rareUp(rare);
                result.push(this.pickItem(finalRare, fairRare, inventory));
            }
            inventory.fairDataUpdate(fairRare);
            return result;
        }
    }

    private static pickItem (rare: string, fairRare: string, inventory: Inventory): Item {    /*    Вычислительная сложность O(1)    */
        let index: number = Math.floor(Math.random() * this.items.get(rare).length)
        if (rare === fairRare)
            inventory.fairItemsUpdate(fairRare, index);
        return this.items.get(rare)[index];
    }

    private static needToCorrect (fairRare: string, inventory: Inventory): boolean {
        let reserveOfIteration: number = 24 - inventory.getIteration(fairRare);
        let needToGet: number = (this.items.get(fairRare).length - inventory.getNumberOfUniqItems(fairRare));
        return needToGet / (reserveOfIteration - 1) > 2;
    }
    private static resultMapUpdate (result: Map<string, Item[]>, rare: string, fairRare: string, inventory: Inventory): void {
        let index: number = Math.floor(Math.random() * this.items.get(rare).length)
        let itemToPush: Item = this.items.get(rare)[index];
        if (rare === fairRare) {
            if (inventory.fairItemsUpdate(fairRare, index))
                result.has("New fair items") ? result.get("New fair items").push(itemToPush) : result.set("New fair items", [itemToPush]);
        } else
            result.has(rare) ? result.get(rare).push(itemToPush) : result.set(rare, [itemToPush]);
    }
    private static resultMapCorrect (result: Map<string, Item[]>, fairRare: string, inventory: Inventory): void {
        if (result.has(fairRare)) {
            this.resultItemReplacement(result, fairRare, inventory);
            return;
        }
        let rareArray = Object.keys(Rareness).filter(x => !(parseInt(x) >= 0));
        for (let rare of rareArray)
            if (result.has(rare)) {
                this.resultItemReplacement(result, rare, inventory);
                return;
            }
    }
    private static resultItemReplacement (result: Map<string, Item[]>, rare: string, inventory: Inventory): void {
        let index: number = Math.floor(Math.random() * result.get(rare).length)
        result.get(rare).slice(index, 1);
        if (result.get(rare).length === 0)
            result.delete(rare);
        result.has("New fair items") ? result.get("New fair items").push(this.pickNewFairItem(rare, inventory)) : result.set("New fair items", [this.pickNewFairItem(rare, inventory)]);
    }
    private static pickNewFairItem (fairRare: string, inventory: Inventory): Item {    /*    Вычислительная сложность O(n), где n - число предметов в jsonItemsBase    */
        let fairItems: boolean[] = inventory.getFairItems(fairRare);
        for (let index = 0; index < fairItems.length; index++)
            if (fairItems[index] === undefined) {
                inventory.fairItemsUpdate(fairRare, index);
                return this.items.get(fairRare)[index];
            }
    }
}

class Inventory {
    private _items: Item[];
    private _fairItems: Map<string, boolean[]>;
    private _fairData: Map<string, [number, number]>;    /*    В Map для каждой редкости содержится массив [Количество итераций, Количество уникальных элементов]    */

    constructor () {
        this._fairItems = new Map<string, boolean[]>();
        this._fairData = new Map<string, [number, number]>();
        let itemsBase: Map<string, Item[]> = Pack.items;
        for (let rare of Array.from(itemsBase.keys()))
            if (rare !== "COMMON") {
                this._fairItems.set(rare, new Array(itemsBase.get(rare).length));
                this._fairData.set(rare, [0, 0]);
            }
    }

    getFairItems (rare: string): boolean[] {
        return this._fairItems.get(rare);
    }
    getIteration (rare: string): number {
        return this._fairData.get(rare)[0];
    }
    getNumberOfUniqItems (rare: string): number {
        return this._fairData.get(rare)[1];
    }
    addItems (newItems: Item[]) {
        if (this._items === undefined)
            this._items = newItems;
        else
            this._items = this._items.concat(newItems);
    }
    fairItemsUpdate (rare: string, index: number): boolean {
        let iteration: number = this.getIteration(rare);
        let NumberOfUniqItems: number = this.getNumberOfUniqItems(rare);
        if (this._fairItems.get(rare)[index] === undefined) {
            this._fairItems.get(rare)[index] = true;
            this._fairData.set(rare, [iteration, NumberOfUniqItems + 1])
            return true;
        } else
            return false;
    }
    fairDataUpdate (rare: string) {
        let iteration: number = this.getIteration(rare);
        let NumberOfUniqItems: number = this.getNumberOfUniqItems(rare);
        if (iteration === 23) {
            this._fairItems.set(rare, new Array(this._fairItems.get(rare).length));
            this._fairData.set(rare, [0, 0]);
        } else
            this._fairData.set(rare, [iteration + 1, NumberOfUniqItems]);
    }

    get items () {
        return this._items;
    }
}

function getPacks (N: number, X: string, rare: string, inventory: Inventory): Item[] {
    let result: Item[] = [];
    switch (X) {
        case "Booster_pack":
            for (let i = 0; i < N; i++)
                result = result.concat(Booster_pack.open(rare));
            break;
        case "Consistent_pack":
            for (let i = 0; i < N; i++)
                result = result.concat(Consistent_pack.open(rare));
            break;
        case "Fair_pack":
            for (let i = 0; i < N; i++)
                result = result.concat(Fair_pack.open(rare, inventory));
            break;
    }
    return result;
}

let instance: Inventory = new Inventory();
instance.addItems(getPacks(24, "Fair_pack", "UNCOMMON", instance));
console.log(instance);