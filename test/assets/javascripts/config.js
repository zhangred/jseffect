function getMap(list, key) {
    let obj = {}
    for( let i=0; i<list.length; i++) {
        obj[list[i][key]] = list [i]
    }
    return obj
}

const condition_list = [
    {title: '全新 N级', value: 1},
    {title: '99新 S级', value: 2},
    {title: '98新 A级', value: 3},
    {title: '97新 AB级', value: 8},
    {title: '95新 B级', value: 4},
    {title: '9新 C级', value: 5},
    {title: '8新 D级', value: 6},
    {title: '二手物品', value: 7}
]
const condition_list_map = getMap(condition_list, 'value')