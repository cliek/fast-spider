import { addTask } from '../../index'

addTask('A', function(next){
    console.log("A")
    next('a')
})

addTask('B', function(next){
    console.log("B")
    next('b')
})

addTask('C', function(next){
    console.log("C")
    next('c')
})