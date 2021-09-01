const search = requests => ({
  input: query => {
    const url = `/search?query=${query}`;
    return requests.get(url);
  }
});

export default search;
