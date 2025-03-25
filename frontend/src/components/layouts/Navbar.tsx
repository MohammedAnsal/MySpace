import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  // const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // const handleLogout = async () => {
  //   const response = await userLogout();
  //   if (response.data) {
  //     toast.success(response.data.message);
  //     localStorage.removeItem("access-token");
  //     dispatch(logout());
  //   }
  // };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { title: "Home", path: isAuthenticated ? "/home" : "/" },
    { title: "About", path: "/about" },
    { title: "Accommodations", path: "/accommodations" },
    { title: "Contact", path: "/contact" },
  ];

  // Animation variants
  const menuVariants = {
    hidden: {
      y: "-100%",
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1], // Custom cubic bezier for smooth animation
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      y: "-100%",
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.65, 0, 0.35, 1],
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      y: -10,
      opacity: 0,
      transition: {
        duration: 0.1,
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        delay: 0.1,
        ease: "easeInOut",
      },
    },
  };

  return (
    <>
      {/* Main Navigation Bar - Always renders but hidden when menu is open */}
      <nav className="flex items-center justify-between bg-[#E2E1DF] px-6 pt-5 pb-8">
        <div className={isOpen ? "opacity-0" : "opacity-100"}>
          <button
            onClick={toggleMenu}
            className="rounded-full bg-[#F2F2F2] px-4 py-2 text-black transition-all hover:bg-[#E5E5E5] focus:outline-none"
          >
            Menu
          </button>
        </div>

        <div className="text-xl font-medium text-black">MySpace</div>

        <div className={isOpen ? "opacity-0" : "opacity-100"}>
          {isAuthenticated ? (
            <button className="rounded-full bg-black px-4 py-2 text-white hover:bg-black/90 transition-all">
              <Link to="/user/profile">Profile</Link>
            </button>
          ) : (
            <button className="rounded-full bg-black px-4 py-2 text-white hover:bg-black/90 transition-all">
              <Link to="/auth/signIn">Login</Link>
            </button>
          )}
        </div>
      </nav>

      {/* Dropdown Menu with Enhanced Animation and Background Blur */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop blur with improved animation */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={backdropVariants}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu with enhanced animations */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
              className="fixed top-0 left-0 right-0 z-50 bg-[#ba9268e6] shadow-lg rounded-b-xl"
            >
              <div className="flex justify-end items-center px-6 pt-5">
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-[#F2F2F2] px-4 py-2 text-black hover:bg-[#E5E5E5] transition-colors"
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={16} />
                </motion.button>
              </div>

              <motion.div className="px-6 py-6">
                <ul className="space-y-4">
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={index}
                      className="py-2 pl-2 font-italiana"
                      variants={itemVariants}
                      custom={index}
                      whileHover={{ x: 10, transition: { duration: 0.2 } }}
                    >
                      <Link
                        to={item.path}
                        className="text-3xl text-white inline-block transition-all"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.title}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
