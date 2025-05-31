
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const MobileLogin = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "Login successful",
        });
        navigate('/mobile/trainings');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header/Logo Area */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Logo/Title Section */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-oppr-blue rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <div className="w-8 h-8 bg-white rounded-md transform rotate-12"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Oppr Training</h1>
            <p className="text-lg text-gray-600 font-medium">Operator Portal</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-oppr-blue/20 focus:border-oppr-blue transition-all text-base"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-oppr-blue/20 focus:border-oppr-blue transition-all text-base"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="w-4 h-4 text-oppr-blue border-gray-300 rounded focus:ring-oppr-blue focus:ring-2"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                />
                <label htmlFor="rememberMe" className="ml-3 text-sm font-medium text-gray-600">
                  Remember Me
                </label>
              </div>

              {/* Login Button */}
              <button 
                type="submit" 
                className="w-full bg-oppr-blue text-white font-bold py-4 px-6 rounded-xl hover:bg-oppr-blue/90 focus:outline-none focus:ring-3 focus:ring-oppr-blue/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Signing In...
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>

          {/* Test Credentials */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="text-sm font-semibold text-blue-900 mb-3">Demo Credentials:</h3>
            <div className="text-xs text-blue-800 space-y-2">
              <div className="bg-white rounded-lg p-3">
                <div className="font-medium">Operator Account:</div>
                <div>operator@oppr.ai / operator123</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="font-medium">Manager Account:</div>
                <div>manager@oppr.ai / manager123</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link to="/" className="text-sm text-oppr-blue hover:underline font-medium">
              ← Back to Gateway
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileLogin;
