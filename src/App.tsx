import { useState, useMemo } from 'react'
import { Search, ChevronUp, ChevronDown } from 'lucide-react'
import fuzzysort from 'fuzzysort'

import { DairyEstablishmentList } from './establishment'
import './App.css'

const preparedNames = DairyEstablishmentList.map((est) => ({
  ...est,
  prepared: {
    regNo: fuzzysort.prepare(`${est.regNo}`),
    name: fuzzysort.prepare(est.name),
    adba: est.adba ? fuzzysort.prepare(est.adba) : null,
    cityProv: fuzzysort.prepare(`${est.city} ${est.province}`),
  },
}))

function App() {
  const [query, setQuery] = useState('')
  const [isHelpExpanded, setIsHelpExpanded] = useState(true)

  const results = useMemo(() => {
    if (!query) return []

    const searchResults = fuzzysort.go(query, preparedNames, {
      keys: [
        'prepared.regNo',
        'prepared.name',
        'prepared.adba',
        'prepared.cityProv',
      ],
      threshold: 0.3,
      limit: 40,
    })

    return searchResults.map((result) => result.obj)
  }, [query])

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Canada Dairy Establishment Search
      </h1>

      <div className="space-y-4 mb-4">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter reg. number, name, or city..."
              className="w-full p-2 pr-10 border rounded-lg bg-white"
              autoFocus={true}
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
        </div>

        <div className="space-y-4">
          {results.map((establishment) => (
            <div
              key={establishment.regNo}
              className="p-4 border rounded-lg bg-white shadow-sm"
            >
              <h2 className="font-semibold text-lg">{establishment.name}</h2>
              {establishment.adba && (
                <p className="text-sm text-gray-600">
                  Also known as: {establishment.adba}
                </p>
              )}
              <div className="mt-2 text-sm space-y-1">
                <p>Registration #: {establishment.regNo}</p>
                <p>{establishment.streetAddr}</p>
                <p>
                  {establishment.city}, {establishment.province}{' '}
                  {establishment.postalCode}
                </p>
                <p>{establishment.telephone}</p>
              </div>
            </div>
          ))}
          {query && results.length < 1 && (
            <div className="p-4 border rounded-lg bg-white shadow-sm text-md">
              No establishment matched
            </div>
          )}
        </div>
      </div>

      <div className="mb-6 bg-white rounded-lg border shadow-sm">
        <button
          onClick={() => setIsHelpExpanded(!isHelpExpanded)}
          className="w-full p-4 border-b flex justify-between items-center hover:bg-gray-50 transition-colors"
          aria-label={isHelpExpanded ? 'Collapse help' : 'Expand help'}
        >
          <h2 className="text-md font-semibold text-left">
            What is a Dairy Establishment Registration Number and where to find
            it
          </h2>
          {isHelpExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {isHelpExpanded && (
          <div className="p-4 space-y-4 text-left">
            <div>
              <h3 className="font-semibold mb-2">
                What is a Dairy Establishment Registration Number:
              </h3>
              <p>
                In Canada, a dairy processing plant must have a Dairy
                Establishment Registration Number in order to sell the products
                made there in other provinces or export them internationally.
                This number is printed on all dairy products manufactured by
                these plants, and allows food inspectors to quickly link a
                product to a specific plant in case of contamination or
                spoilage.
              </p>
              <p>
                Because the registration number uniquely identifies a processing
                plant, it can also be used to find out which company actually
                manufactures a grocery store chain's generic brand dairy
                products. Additionally, it can be used to estimate how far the
                product had to be transported to reach the local store shelves
                for consumers who want to support local producers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                Where to find the Dairy Establishment Registration Number on a
                product:
              </h3>
              <p>
                There are no set rules on where and how the number must be
                displayed on the products, but here are some common locations:
              </p>
              <ul className="list-disc ml-5 mt-2 space-y-2">
                <li>
                  Printed with the "best before" date, often prefixed with
                  "REG." or "AGRT"
                </li>
                <li>Inside a small rectangle on the back label</li>
                <li>
                  Printed along with other food certification labels such as
                  organic certification
                </li>
              </ul>
              <p>
                A dairy product may not have a registration number printed if it
                was imported from outside Canada or the producer does not sell
                any of their dairy products outside their home province and is
                not required to obtain a Dairy Establishment Registration
                Number.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                Where does this data come from:
              </h3>
              <p>
                This information comes from a list of registered dairy
                establishment published by Canadian Dairy Commission in
                September 2017.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
