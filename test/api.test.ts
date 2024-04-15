import axios from "axios";

axios.defaults.validateStatus = function () {
    return true;
}

test("Deve criar uma cota para o passageiro", async function(){
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "93051703079",
        isPassanger: true
    };
    const output = await axios.post("http://localhost:3000/signup", input);
    console.log(output.status, output.data);
})
