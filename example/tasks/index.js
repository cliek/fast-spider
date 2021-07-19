import { addTask } from '../../index'

addTask('A', function(next){
    console.log("A")
    next('B')
})

addTask('B', function(next){
    console.log("B")
    next('C')
})

addTask('C', function(next){
    console.log("C")
    next('D')
})