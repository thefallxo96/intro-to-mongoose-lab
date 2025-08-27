require('dotenv').config();
const mongoose = require('mongoose');
const prompt = require('prompt-sync')();
const Customer = require('./models/customer'); // file name matches exactly

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("\nWelcome to the CRM\n");

    let running = true;
    while (running) {
      console.log(`
What would you like to do?
1. Create a customer
2. View all customers
3. Update a customer
4. Delete a customer
5. Seed sample customers
6. Quit
      `);

      const choice = prompt('Number of action to run: ');

      switch (choice) {
        case '1':
          await createCustomer();
          break;
        case '2':
          await viewCustomers();
          break;
        case '3':
          await updateCustomer();
          break;
        case '4':
          await deleteCustomer();
          break;
        case '5':
          await seedCustomers();
          break;
        case '6':
          running = false;
          console.log('Exiting...');
          break;
        default:
          console.log('Invalid choice, try again.');
      }
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

// Create
async function createCustomer() {
  const name = prompt('Enter customer name: ');
  const age = Number(prompt('Enter customer age: '));
  const customer = new Customer({ name, age });
  await customer.save();
  console.log(`Customer ${name} added.\n`);
}

// Read
async function viewCustomers() {
  const customers = await Customer.find();
  if (customers.length === 0) {
    console.log("No customers found.\n");
  } else {
    customers.forEach(c =>
      console.log(`id: ${c._id} --  Name: ${c.name}, Age: ${c.age}`)
    );
  }
}

// Update
async function updateCustomer() {
  console.log("\nBelow is a list of customers:\n");
  await viewCustomers();

  const id = prompt('\nCopy and paste the id of the customer you would like to update here: ');
  const name = prompt("What is the customer's new name? ");
  const age = Number(prompt("What is the customer's new age? "));
  
  await Customer.findByIdAndUpdate(id, { name, age });
  console.log('\nCustomer updated.\n');
}

// Delete
async function deleteCustomer() {
  await viewCustomers();
  const id = prompt('\nEnter ID of customer to delete: ');
  await Customer.findByIdAndDelete(id);
  console.log('Customer deleted.\n');
}

// Seed sample customers
async function seedCustomers() {
  const sample = [
    { name: "Matt", age: 43 },
    { name: "Vivienne", age: 6 }
  ];

  await Customer.insertMany(sample);
  console.log("Sample customers added.\n");
}

main();
