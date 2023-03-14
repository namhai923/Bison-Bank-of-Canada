export default function sortByTime(data) {
    let sortedData = [...data];
    return sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
}
