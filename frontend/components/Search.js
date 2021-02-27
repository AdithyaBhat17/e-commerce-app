import { DropDown, DropDownItem, SearchStyles } from "./styles/DropDown";

import { resetIdCounter, useCombobox } from "downshift";
import gql from "graphql-tag";
import { useLazyQuery } from "@apollo/client";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";

export const SEARCH_PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS($searchTerm: String!) {
    searchedItems: allProducts(
      where: {
        OR: [
          { name_contains_i: $searchTerm }
          { description_contains_i: $searchTerm }
        ]
      }
    ) {
      id
      name
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

function Search() {
  const router = useRouter();
  const [findItems, { data, loading, error }] = useLazyQuery(
    SEARCH_PRODUCTS_QUERY,
    {
      fetchPolicy: "no-cache",
    }
  );

  const debouncedFindItems = debounce(findItems, 500);

  const items = data?.searchedItems ?? [];

  resetIdCounter(); // takes care of SSR and CSR mismatch
  const {
    isOpen,
    inputValue,
    getMenuProps,
    getItemProps,
    getComboboxProps,
    getInputProps,
    highlightedIndex,
  } = useCombobox({
    items,
    onInputValueChange() {
      debouncedFindItems({
        variables: {
          searchTerm: inputValue,
        },
      });
    },
    onSelectedItemChange({ selectedItem }) {
      console.log(selectedItem);
      router.push({
        pathname: `/product/${selectedItem.id}`,
      });
    },
    itemToString: (item) => item?.name ?? "",
  });

  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: "search",
            placeholder: "Search for an item...",
            id: "search",
            className: loading ? "loading" : "",
          })}
        />
      </div>
      <DropDown {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <DropDownItem
              {...getItemProps({ item })}
              key={item.id}
              highlighted={index === highlightedIndex}
            >
              <img
                width='50'
                src={item.photo.image.publicUrlTransformed}
                alt={item.name}
              />
              {item.name}
            </DropDownItem>
          ))}
        {isOpen && !items.length && !loading ? (
          <DropDownItem>No items found for "{inputValue}"</DropDownItem>
        ) : null}
      </DropDown>
    </SearchStyles>
  );
}

export default Search;
