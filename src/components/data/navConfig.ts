export type NavItemLeft = {
  title: string;
  status: string;
  href: string;
};

export type NavItemRight = {
  title: string;
  url: string;
};

export const navDataLeft: NavItemLeft[] = [
  { title: "Home", status: "Home", href:'/' },
  { title: "Practice Questions", status: "Practice Questions", href:'/' },
  { title: "Exam tutoring", status: "Exam tutoring", href: '/' },
  { title: "FAQ", status: "FAQ", href:'/' },
  { title: "Contact", status: "Contact" , href:'/contact'},
]
// Practice Questions, Exam tutoring, FAQ, Contact, Login, Cart



export const navDataRight: NavItemRight[] = [
  { title: "Login", url: "/login" },
  { title: "Cart", url: "/cart" }
]