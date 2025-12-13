export type NavItemLeft = {
  title: string;
  status: string;
};

export type NavItemRight = {
  title: string;
  url: string;
};

export const navDataLeft: NavItemLeft[] = [
  { title: "Practice Questions", status: "Practice Questions" },
  { title: "Exam tutoring", status: "Exam tutoring" },
  { title: "FAQ", status: "FAQ" },
  { title: "Contact", status: "Contact" },
]
// Practice Questions, Exam tutoring, FAQ, Contact, Login, Cart



export const navDataRight: NavItemRight[] = [
  { title: "Login", url: "/login" },
  { title: "Cart", url: "/cart" }
]