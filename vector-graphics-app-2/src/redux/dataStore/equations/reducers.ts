import { DataSliceReducer } from '../dataSlice';
import { computeAllResults, updateEquationInput } from './computeResult';

const submitEquation: DataSliceReducer<{ id: string; input: string }> = (state, { payload }) => {
  updateEquationInput({ equationId: payload.id, value: payload.input, state });
};

const renameEquation: DataSliceReducer<{ oldId: string; newId: string }> = (state, { payload }) => {
  if (!(payload.oldId in state.equations)) return; // ERROR: oldId should have existed

  // check if equation under newId already has children (those need to be maintained) or has an input (error)
  let childrenNewId: string[] = [];
  if (payload.newId in state.equations) {
    if (state.equations[payload.newId].input) return; // ERROR: newId already has an existing input value
    childrenNewId = [...state.equations[payload.newId].dependencies.children];
  }

  // register equation under new id (at this point both, old and new, ids will point to the equation)
  state.equations[payload.newId] = state.equations[payload.oldId];

  // remove equation from the oldId
  if (state.equations[payload.oldId].dependencies.children.length > 0) {
    // any children referencing the oldId should remain there, while the input and everything else moves to newId
    state.equations[payload.oldId] = {
      id: payload.oldId,
      input: undefined,
      dependencies: { children: state.equations[payload.newId].dependencies.children, parents: [] },
    };

    // now that the children have been properly reassigned, they have to be evaluated with the new dependencies
    // all those children will have at least a missing dependency now
    computeAllResults({ equationId: payload.oldId, state });
  } else {
    // no children -> the equation under oldId can be deleted
    delete state.equations[payload.oldId];
  }

  // as the oldId got all required information now, we can set id and and children of the newId correctly
  state.equations[payload.newId].id = payload.newId;
  state.equations[payload.newId].dependencies.children = childrenNewId;

  // if any children already referenced the newId, those can now be evaluated
  if (childrenNewId.length > 0) {
    computeAllResults({ equationId: payload.newId, state });
  }

  // finally, we can inform the parents of our equation about the name change
  state.equations[payload.newId].dependencies.parents.forEach((parentId: string) => {
    const children = state.equations[parentId].dependencies.children;
    const index = children.indexOf(payload.oldId);
    children[index] = payload.newId;
  });
};

export const equationReducers = { submitEquation, renameEquation };
