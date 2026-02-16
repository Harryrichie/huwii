"use server"
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function userWhom() {
  const user = await currentUser();
  if (!user) return null;

  const email = user.emailAddresses[0].emailAddress;

  // Try to find the user by Clerk ID OR Email
  const existingUser = await db.user.findFirst({
    where: {
      OR: [
        { clerkId: user.id },
        { email: email }
      ]
    }
  });
  // If user exists, update them to ensure BOTH clerkId and email match
  if (existingUser) {
    return await db.user.update({
      where: { id: existingUser.id }, // Use the internal DB primary key
      data: {
        clerkId: user.id,
        email: email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      }
    });
  }
  //If no user exists, create a new one
  return await db.user.create({
    data: {
      clerkId: user.id,
      email: email,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    }
  });
}
  