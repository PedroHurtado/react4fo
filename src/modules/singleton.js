class Foo {
    constructor(){
        console.log("Foo Singleton")
    }
}

const foo = new Foo()

export{
    foo,
    Foo
}