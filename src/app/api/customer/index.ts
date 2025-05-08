import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function postCustomerHandler({ req }: { req: any }) {
  return await createCustomerDb(req);
}

export async function postGetAllCustomersHandler({ req }: { req: any }) {
  return await postGetAllCustomers(req);
}

export async function getCustomersHandler() {
  return await fetchAllCustomersDb();
}

export async function getCustomerHandler({ req }: { req: any }) {
  return await fetchCustomerDb(req);
}

export async function patchCustomerHandler({ data, id }: { data: any, id: any }) {
  return await updateCustomerDb(data, id);
}

export async function removeCustomerHandler({ data, id }: { data: any, id: any }) {
  return await removeCustomerDb(data, id);
}

interface CustomerProfileData {
  id: string;
  email: string;
  vat: string;
  iban: string;
  firstName: string;
  companyName: string;
  operationAddress: string;
  operationPostCode: string;
  operationProvince: string;
  operationCity: string;
  officeAddress: string;
  officePostCode: string;
  officeCity: string;
  officeProvince: string;
  phoneNumber: string;
  mobileNumber: string;
  notes: string;
  isVerified: boolean;
  isVerifiedBySA: boolean;
  files: object,
  postalBulletin: boolean,
  fiberMobileNumber: string,
}

async function createCustomerDb(payload: CustomerProfileData) {
  try {
    return await prisma.customer.create({
      data: payload,
    });
  } catch (error) {
    throw error;
  }
}

async function updateCustomerDb(data: any, id: any) {
  try {
    const customerId = data.id;
    delete data['id'];
    return await prisma.customer.update({
      where: {
        agencyId: id,
        id: customerId
      },
      data: data
    });
  } catch (error) {
    throw error;
  }
}

export async function postGetAllCustomers(payload: any) {
  try {
    return await prisma.customer.findMany({
      where: { agencyId: payload.id },
    });
  } catch (error) {
    throw error;
  }
}

export async function fetchAllCustomersDb() {
  try {
    return await prisma.customer.findMany();
  } catch (error) {
    throw error;
  }
}

async function fetchCustomerDb({ agencyId, customerId }: { agencyId:string, customerId:string }) {
  try {
    return await prisma.customer.findUnique({
      where: {
        agencyId,
        id: customerId
      },
    });
  } catch (error) {
    throw error;
  }
}

async function removeCustomerDb(data: any, id: any) {
  try {
    return await prisma.customer.delete({
      where: {
        id: data,
        agencyId: id
      },
    });
  } catch (error) {
    throw error;
  }
}

