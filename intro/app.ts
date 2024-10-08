import dotenv from "dotenv"

dotenv.config();

import OpenAI from "openai"

const openai = new OpenAI();

const knowledge = {
  NewYork: {
    "Nike SB": {
      "size 9": 1,
      "size 10": 13,
      "size 11": 12,
      "size 12": 8,
    }
  },
  LosAngeles: {
    "Nike SB": {
      "size 9": 10,
      "size 10": 3,
      "size 11": 10,
      "size 12": 7,
      "size 13": 2,
    }
  }
}

const goal = "Make a million euros";
const numTasks = 5;

const fn: any = {
  add: (object: { num1: number, num2: number }) => {
    const sum = object.num1 + object.num2;

    console.log("The sum is: " + sum)
  },
  substract: (object: { num1: number, num2: number }) => {
    const sum = object.num1 - object.num2;

    console.log("The difference is: " + sum)
  }
}


console.log("generating...")

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  temperature: 0,
  messages: [
    // {
    //   role: "system",
    //   content: `
    //    You are a Best-Shoes chatbot, called Bestie Shoey.

    //    Here is your entire knowledge. You know nothing but this knowledge: ${JSON.stringify(knowledge)}.
    //    Carefully read through the stock a few times and only consider an item to be available if it has more than 1 unit.
    //    Pay close attention to the location, and do not confuse stock between the locations. This could be bad for business. 
    //   `
    // },
    // {
    //   role: "user",
    //   content: "Hi, i want to buy Nike SB Shoes, Size 13. Do you have them in stock in New York?"
    // }
    // {
    //   role: "system",
    //   content: `
    //   You are a talented task planner. 
    //   The user will tell you their goal and you will generate a list of tasks for them.

    //   You must respond in JSON, strictly following this schema:
    //   {
    //    tasks: {
    //       title: string, //max 100 characters
    //       content: string, //max 200 characters
    //       diffuculty: "easy" | "medium" | "hard",
    //    }[],
    //   }
    //   `
    // },
    // {
    //   role: "user",
    //   content: `Tell me how to achive ${goal}, produce ${numTasks} tasks.`
    // }
    {
      role: "system",
      content: `
       You are a helpful assistant in solving math problems.
      `
    },
    {
      role: "user",
      content: `What is 40 minus 20?`
    }
  ],
  functions: [
    {
      name: "add",
      description: "Add two numbers",
      parameters: {
        type: "object",
        properties: {
          num1: {
            type: "number"
          },
          num2: {
            type: "number"
          }
        }
      }
    },
    {
      name: "substract",
      description: "Substract two numbers",
      parameters: {
        type: "object",
        properties: {
          num1: {
            type: "number"
          },
          num2: {
            type: "number"
          }
        }
      }
    }
  ],
});

// const formattedResponse = JSON.parse(response.choices[0].message.content as string);

// console.log(response.usage)
// console.log(response.choices[0].message.content)
// console.log(formattedResponse.tasks)
console.log(response.choices[0]);

const functionCall = response.choices[0].message.function_call;

if (functionCall) {
  const name = functionCall.name;
  const args = JSON.parse(functionCall.arguments);

  const action = fn[name];
  action(args);
}

