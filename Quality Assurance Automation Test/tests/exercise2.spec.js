// @ts-check
import { test, expect } from '@playwright/test';
import PetAnalyzer from '../utils/petAnalyzer';

const generateRandomString = () => {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
};

const listSoldPetNames = (petList) => {
    return petList.map(pet => ({ id: pet.id, name: pet.name }));
};

test.describe.serial('Exercise 2: Data handling in APIs', () => {
    const BASE_URL = 'https://petstore.swagger.io/v2';

    const USERNAME = 'user_' + generateRandomString();
    const PASSWORD = generateRandomString();
    const USER_DATA = {
        username: USERNAME,
        firstName: USERNAME,
        lastName: USERNAME,
        email: "email@gmail.com",
        password: PASSWORD,
        phone: "666554433"
    };

    test('Should create a user, log in, and retrieve its data', async ({ request }) => {
        let userId; 

        console.log('--- Step 1: Create User (POST /user) ---');
        const createUserResponse = await request.post(`${BASE_URL}/user`, {
            data: USER_DATA
        });

        expect(createUserResponse.status()).toBe(200);
        const createUserResponseBody = await createUserResponse.json();
        console.log('Create User Response:', createUserResponseBody);

        console.log('\n--- Step 2: Login User (GET /user/login) ---');
        const loginUserResponse = await request.get(`${BASE_URL}/user/login`, {
            params: {
                username: USERNAME,
                password: PASSWORD
            }
        });

        expect(loginUserResponse.status()).toBe(200);
        const loginUserResponseBody = await loginUserResponse.json();
        console.log('Login User Response:', loginUserResponseBody);

        console.log('\n--- Step 3: Get User Details (GET /user/{username}) ---');
        const getUserResponse = await request.get(`${BASE_URL}/user/${USERNAME}`);

        expect(getUserResponse.status()).toBe(200);
        const getUserResponseBody = await getUserResponse.json();
        console.log('Get User Details Response:', getUserResponseBody);

        expect(getUserResponseBody.username).toBe(USER_DATA.username);
        expect(getUserResponseBody.firstName).toBe(USER_DATA.firstName);
        expect(getUserResponseBody.lastName).toBe(USER_DATA.lastName);
        expect(getUserResponseBody.email).toBe(USER_DATA.email);
        expect(getUserResponseBody.password).toBe(USER_DATA.password);
        expect(getUserResponseBody.phone).toBe(USER_DATA.phone);
        expect(getUserResponseBody.id).toBeDefined();
        expect(typeof getUserResponseBody.id).toBe('number');
        expect(getUserResponseBody.userStatus).toBeDefined();
        expect(typeof getUserResponseBody.userStatus).toBe('number');
    });

    test('Should list names and IDs of sold pets', async ({ request }) => {
        console.log('\n--- Step 4: Get Sold Pets (GET /pet/findByStatus?status=sold) ---');
        const findByStatusResponse = await request.get(`${BASE_URL}/pet/findByStatus`, {
            params: {
                status: 'sold'
            }
        });

        expect(findByStatusResponse.status()).toBe(200);
        const pets = await findByStatusResponse.json();

        const soldPetsInfo = listSoldPetNames(pets);
        console.log('\nNames and IDs of Sold Pets:');
        if (soldPetsInfo.length > 0) {
            soldPetsInfo.forEach(pet => {
                console.log(`{ id: ${pet.id}, name: "${pet.name}" }`);
            });
        } else {
            console.log('No sold pets found.');
        }
    });

    test('Should list names and IDs of sold pets and count names', async ({ request }) => {
        const findByStatusResponse = await request.get(`${BASE_URL}/pet/findByStatus`, {
            params: {
                status: 'sold'
            }
        });

        expect(findByStatusResponse.status()).toBe(200);
        const pets = await findByStatusResponse.json();

        const soldPetsInfo = listSoldPetNames(pets);

        // --- Use PetAnalyzer class to count pets by same name ---
        console.log('\n--- Step 5: Analyze Pet Names ---');
        const petAnalyzer = new PetAnalyzer(soldPetsInfo);
        const nameCounts = petAnalyzer.countPetsBySameName();

        console.log('Pet Name Counts:');
        console.log(JSON.stringify(nameCounts, null, 2));
    });

    test('delete user', async ({ request }) => {
        console.log('\n--- Cleanup: Deleting User (DELETE /user/{username}) ---');
        const deleteUserResponse = await request.delete(`${BASE_URL}/user/${USERNAME}`);
        // Assert that the user was deleted (status 200) or not found (status 404 if already deleted/never created)
        // We expect 200 if successful, or 404 if the user wasn't created or was already deleted by another test.
        expect([200, 404]).toContain(deleteUserResponse.status());
        console.log('Delete User Response Status:', deleteUserResponse.status());
    });



    
});
