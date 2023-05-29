import { openDB } from 'idb';

const STORE_NAME = 'searches'
const dbPromise = openDB('App-Database', 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME);
  },
});

export async function getSearches(key) {
  const values = await (await dbPromise).get(STORE_NAME, key[0]);
  console.log(values)

  if(!values) return null
  if(key.length === 1){
    return values
  }
  const filtered = values.filter((el, index) => el.includes(key))
  return filtered
};

export async function storeSearches(val) {
    const indexKey = (val[0]).toLocaleLowerCase()
    const existingValues = (await getSearches(indexKey)) || []
    if(existingValues.indexOf(val.toLocaleLowerCase()) !== -1){
        return
    }
    existingValues.push(val)
    return (await dbPromise).put(STORE_NAME, existingValues, indexKey);
};
