const { SearchPage } = require("../../components/searchPage");

export default function SearchByTag() {
  return SearchPage("Tags", "search for images using content tags!", "tags");
}
