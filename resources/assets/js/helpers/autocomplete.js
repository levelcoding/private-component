import algolia from 'algoliasearch'
import autocomplete from 'autocomplete.js'

// You had the admin key insteda of search key, yes stupid mistake...
// it was me trying to fix it, just forgot to change it back.
var index = algolia('LGT43QI00B', '4a238bf83fe14ae1ebe7a1021e803497') 

export const userautocomplete = selector => {
    var users = index.initIndex('users')

    return autocomplete(selector, {}, {
        source: autocomplete.sources.hits(users, { hitsPerPage: 10 }),
        displayKey: 'name',
        templates: {
            suggestion (suggestion) {
                return '<span>' + suggestion.name + '</span>'
            },
            empty: '<div class="aa-empty">No people found.</div>'
        }
    })
}
