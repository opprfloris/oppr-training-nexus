
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const DesktopLogin = () => {
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
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        navigate('/desktop/dashboard');
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
    <div className="min-h-screen bg-oppr-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-oppr-blue rounded-lg mx-auto mb-4 flex items-center justify-center transform rotate-3">
            <div className="w-8 h-8 bg-white rounded-sm"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Oppr Training</h1>
          <h2 className="text-xl text-gray-700 mb-1">Desktop Experience - Manager Portal</h2>
          <p className="text-gray-600">Access your training management dashboard</p>
        </div>

        <div className="oppr-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="oppr-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="oppr-input pr-12"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="w-4 h-4 text-oppr-blue border-gray-300 rounded focus:ring-oppr-blue"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>

            <button 
              type="submit" 
              className="w-full oppr-button-primary"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In to Manager Portal"}
            </button>
          </form>
        </div>

        {/* Test Credentials */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Test Credentials:</h3>
          <div className="text-xs text-blue-800 space-y-1">
            <div>
              <strong>Operator:</strong> operator@oppr.ai / operator123
            </div>
            <div>
              <strong>Manager:</strong> manager@oppr.ai / manager123
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-oppr-blue hover:underline">
            ← Back to Gateway
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DesktopLogin;
