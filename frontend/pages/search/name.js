const { SearchPage } = require("../../components/searchPage");

export default function SearchByName() {
  return SearchPage("Name", "search for images using filename", "name");
}
