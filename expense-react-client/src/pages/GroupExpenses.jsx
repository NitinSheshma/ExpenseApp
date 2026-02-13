import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import AddExpenseModal from "../components/AddExpenseModal";
import ExpenseCard from "../components/ExpenseCard";
import SettlementSummary from "../components/SettlementSummary";

function GroupExpenses() {
    const { groupId } = useParams();

    const [group, setGroup] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    // Fetch group details
    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                // Since we don't have a dedicated get group endpoint, 
                // we can use the groups/my-groups and filter
                // For now, we'll show the groupId and fetch expenses
                const expenseResponse = await axios.get(
                    `${serverEndpoint}/expenses/group/${groupId}`,
                    { withCredentials: true }
                );
                setExpenses(expenseResponse.data.expenses || []);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroupDetails();
    }, [groupId]);

    // Fetch group details by making a request to get all groups and filter
    useEffect(() => {
        const fetchFullGroupDetails = async () => {
            try {
                const response = await axios.get(
                    `${serverEndpoint}/groups/my-groups`,
                    { withCredentials: true }
                );
                const foundGroup = response.data.find((g) => g._id === groupId);
                if (foundGroup) {
                    setGroup(foundGroup);
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (groupId) {
            fetchFullGroupDetails();
        }
    }, [groupId]);

    const handleAddExpenseSuccess = (newExpense) => {
        setExpenses([newExpense, ...expenses]);
    };

    const handleExpenseDelete = (expenseId) => {
        setExpenses(expenses.filter((e) => e._id !== expenseId));
    };

    const handleGroupSettle = (updatedGroup) => {
        setGroup(updatedGroup);
    };

    if (loading) {
        return (
            <div
                className="container p-5 d-flex flex-column align-items-center justify-content-center"
                style={{ minHeight: "60vh" }}
            >
                <div
                    className="spinner-grow text-primary"
                    role="status"
                    style={{ width: "3rem", height: "3rem" }}
                >
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted fw-medium">Loading group expenses...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/dashboard">Groups</Link>
                    </li>
                    <li className="breadcrumb-item active">
                        {group?.name || "Expense Details"}
                    </li>
                </ol>
            </nav>

            {/* Group Header */}
            {group && (
                <div className="mb-5">
                    <h2 className="fw-bold display-6 mb-2">
                        {group.name}
                    </h2>
                    <p className="text-muted">
                        {group.description}
                    </p>
                    <div className="mt-3">
                        <h6 className="fw-bold mb-2">Members:</h6>
                        <div className="d-flex flex-wrap gap-2">
                            {group.membersEmail.map((member, index) => (
                                <span key={index} className="badge bg-primary">
                                    {member}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Settlement Summary */}
            {group && (
                <SettlementSummary
                    groupId={groupId}
                    group={group}
                    onGroupSettle={handleGroupSettle}
                />
            )}

            {/* Add Expense Section */}
            <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold mb-0">Expenses</h4>
                    <button
                        className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm"
                        onClick={() => setShow(true)}
                    >
                        <i className="bi bi-plus-lg me-2"></i>
                        Add Expense
                    </button>
                </div>

                {expenses.length === 0 ? (
                    <div className="text-center py-5 bg-light rounded-4 border border-dashed border-primary border-opacity-25">
                        <i
                            className="bi bi-wallet2 text-primary"
                            style={{ fontSize: "3rem" }}
                        ></i>
                        <h5 className="fw-bold mt-3">No Expenses Yet</h5>
                        <p className="text-muted">Start adding expenses to track costs</p>
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => setShow(true)}
                        >
                            Add First Expense
                        </button>
                    </div>
                ) : (
                    <div>
                        {expenses.map((expense) => (
                            <ExpenseCard
                                key={expense._id}
                                expense={expense}
                                onDelete={handleExpenseDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Add Expense Modal */}
            {group && (
                <AddExpenseModal
                    show={show}
                    onHide={() => setShow(false)}
                    groupId={groupId}
                    groupMembers={group.membersEmail}
                    onSuccess={handleAddExpenseSuccess}
                />
            )}
        </div>
    );
}

export default GroupExpenses;
