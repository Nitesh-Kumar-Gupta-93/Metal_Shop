import React from 'react';
import './msg.css';  // Make sure to import the external CSS file
import { Link } from 'react-router-dom';

const Messages = () => {
    return (
        <div className="app-container">
            {/* Header */}
            <header>
                <div className="logo">Admin Dashboard</div>
                <nav>
                    <ul>
                        <li><Link to="/admin">Dashboard</Link></li>
                                    <li><Link to="/admin/products">Products</Link></li>
                                    <li><Link to="/admin/users">Users</Link></li>
                                    <li><Link to="/admin/orders">Orders</Link></li>
                                    <li><Link to="/admin/messages">Contact Messages</Link></li>
                                    <li><Link to="/admin/logout">Logout</Link></li>
                    </ul>
                </nav>
            </header>

            {/* Main Content */}
            <main>
                <h1>Contact Messages</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Message ID</th>
                            <th>Sender Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>John Doe</td>
                            <td>john@example.com</td>
                            <td>Inquiry</td>
                            <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jane Smith</td>
                            <td>jane@example.com</td>
                            <td>Support</td>
                            <td>Quisque velit nisi, pretium ut lacinia in, elementum id enim.</td>
                        </tr>
                        {/* Add more messages as needed */}
                    </tbody>
                </table>
            </main>

            {/* Footer */}
            <footer>
                <p>&copy; 2025 Company Name. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Messages;
